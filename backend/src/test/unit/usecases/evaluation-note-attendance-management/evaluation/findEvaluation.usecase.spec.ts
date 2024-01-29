import FindEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findEvaluation.usecase';
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

describe('findEvaluation usecase unit test', () => {
  const evaluation1 = new Evaluation({
    lesson: new Id().id,
    teacher: new Id().id,
    type: 'evaluation',
    value: 10,
  });
  describe('On success', () => {
    it('should find an evaluation', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(evaluation1);
      const usecase = new FindEvaluation(evaluationRepository);

      const result = await usecase.execute({ id: evaluation1.id.id });

      expect(evaluationRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(undefined);

      const usecase = new FindEvaluation(evaluationRepository);
      const result = await usecase.execute({
        id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
      });

      expect(result).toBe(undefined);
    });
  });
});
