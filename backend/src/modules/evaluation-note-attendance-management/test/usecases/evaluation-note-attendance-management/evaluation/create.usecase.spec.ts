import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/create.usecase';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

const MockRepository = (): jest.Mocked<EvaluationGateway> => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(evaluation => Promise.resolve(evaluation.id.value)),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createEvaluation usecase unit test', () => {
  const input = {
    lesson: new Id().value,
    teacher: new Id().value,
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
    it('should create an evaluation', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateEvaluation(evaluationRepository);
      const result = await usecase.execute(input);

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(evaluationRepository.create).toHaveBeenCalledWith(
        expect.any(Evaluation)
      );
      expect(result).toBeDefined();
    });
  });
});
