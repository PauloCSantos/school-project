import UpdateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/updateEvaluation.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';

const MockRepository = () => {
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
    lesson: new Id().id,
    teacher: new Id().id,
    type: 'evaluation',
    value: 10,
  };

  const evaluation1 = new Evaluation({
    lesson: new Id().id,
    teacher: new Id().id,
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
    });
  });
  describe('On success', () => {
    it('should update an evaluation', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(evaluation1);
      const usecase = new UpdateEvaluation(evaluationRepository);

      const result = await usecase.execute({
        id: evaluation1.id.id,
        ...input,
      });

      expect(evaluationRepository.update).toHaveBeenCalled();
      expect(evaluationRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        lesson: input.lesson,
        teacher: input.teacher,
        type: input.type,
        value: input.value,
      });
    });
  });
});
