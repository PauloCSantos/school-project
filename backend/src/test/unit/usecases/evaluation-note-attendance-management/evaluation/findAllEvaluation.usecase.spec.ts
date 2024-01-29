import FindAllEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findAllEvaluation.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findAllEvaluation usecase unit test', () => {
  const evaluation1 = new Evaluation({
    lesson: new Id().id,
    teacher: new Id().id,
    type: 'evaluation',
    value: 10,
  });
  const evaluation2 = new Evaluation({
    lesson: new Id().id,
    teacher: new Id().id,
    type: 'home work',
    value: 10,
  });

  describe('On success', () => {
    it('should find all evaluations', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.findAll.mockResolvedValue([
        evaluation1,
        evaluation2,
      ]);
      const usecase = new FindAllEvaluation(evaluationRepository);

      const result = await usecase.execute({});

      expect(evaluationRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllEvaluation(evaluationRepository);

      const result = await usecase.execute({});

      expect(evaluationRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
