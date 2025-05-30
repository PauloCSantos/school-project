import Id from '@/modules/@shared/domain/value-object/id.value-object';
import FindEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/find.usecase';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

const MockRepository = (): jest.Mocked<EvaluationGateway> => {
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
    lesson: new Id().value,
    teacher: new Id().value,
    type: 'evaluation',
    value: 10,
  });

  describe('On success', () => {
    it('should find an evaluation', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(evaluation1);
      const usecase = new FindEvaluation(evaluationRepository);

      const result = await usecase.execute({ id: evaluation1.id.value });

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        evaluation1.id.value
      );
      expect(result).toBeDefined();
      expect(result).toEqual({
        id: evaluation1.id.value,
        lesson: evaluation1.lesson,
        teacher: evaluation1.teacher,
        type: evaluation1.type,
        value: evaluation1.value,
      });
    });

    it('should return undefined when id is not found', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(undefined);

      const usecase = new FindEvaluation(evaluationRepository);
      const result = await usecase.execute({
        id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
      });

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        '75c791ca-7a40-4217-8b99-2cf22c01d543'
      );
      expect(result).toBeUndefined();
    });
  });
});
