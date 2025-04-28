import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UpdateEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/update.usecase';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

const MockRepository = (): jest.Mocked<EvaluationGateway> => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(evaluation => Promise.resolve(evaluation)),
    delete: jest.fn(),
  };
};

describe('updateEvaluation usecase unit test', () => {
  const input = {
    lesson: new Id().value,
    teacher: new Id().value,
    type: 'evaluation',
    value: 10,
  };

  const evaluation1 = new Evaluation({
    lesson: new Id().value,
    teacher: new Id().value,
    type: 'home work',
    value: 5,
  });

  describe('On fail', () => {
    it('should throw an error if the evaluation does not exist', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateEvaluation(evaluationRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('Evaluation not found');

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        '75c791ca-7a40-4217-8b99-2cf22c01d543'
      );
      expect(evaluationRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should update an evaluation', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(evaluation1);
      const usecase = new UpdateEvaluation(evaluationRepository);

      const result = await usecase.execute({
        id: evaluation1.id.value,
        ...input,
      });

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        evaluation1.id.value
      );
      expect(evaluationRepository.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: evaluation1.id,
          lesson: input.lesson,
          teacher: input.teacher,
          type: input.type,
          value: input.value,
        })
      );
      expect(result).toStrictEqual({
        id: evaluation1.id.value,
        lesson: input.lesson,
        teacher: input.teacher,
        type: input.type,
        value: input.value,
      });
    });
  });
});
