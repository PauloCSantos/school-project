import Id from '@/modules/@shared/domain/value-object/id.value-object';
import DeleteEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/delete.usecase';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
  };
};

describe('deleteEvaluation usecase unit test', () => {
  const input = {
    lesson: new Id().value,
    teacher: new Id().value,
    type: 'evaluation',
    value: 10,
  };

  const evaluation = new Evaluation(input);

  describe('On fail', () => {
    it('should return an error if the evaluation does not exist', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteEvaluation(evaluationRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('Evaluation not found');
    });
  });
  describe('On success', () => {
    it('should delete a evaluation', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(evaluation);
      const usecase = new DeleteEvaluation(evaluationRepository);
      const result = await usecase.execute({
        id: evaluation.id.value,
      });

      expect(evaluationRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
