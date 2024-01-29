import CreateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/createEvaluation.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(evaluation => Promise.resolve(evaluation.id.id)),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createEvaluation usecase unit test', () => {
  const input = {
    lesson: new Id().id,
    teacher: new Id().id,
    type: 'evaluation',
    value: 10,
  };

  const evaluation = new Evaluation(input);

  describe('On fail', () => {
    it('should throw an error if the evaluation already exists', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(evaluation);

      const usecase = new CreateEvaluation(evaluationRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Evaluation already exists'
      );
      expect(evaluationRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(evaluationRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a evaluation', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateEvaluation(evaluationRepository);
      const result = await usecase.execute(input);

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(evaluationRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined;
    });
  });
});
