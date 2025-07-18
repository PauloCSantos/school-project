import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import DeleteEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/delete.usecase';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

describe('deleteEvaluation usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;
  const MockRepository = (): jest.Mocked<EvaluationGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn((_id: string) =>
        Promise.resolve('Operação concluída com sucesso')
      ),
    };
  };

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  const input = {
    lesson: new Id().value,
    teacher: new Id().value,
    type: 'evaluation',
    value: 10,
  };

  policieService = MockPolicyService();
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };

  const evaluation = new Evaluation(input);

  describe('On fail', () => {
    it('should return an error if the evaluation does not exist', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(null);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new DeleteEvaluation(evaluationRepository);

      await expect(
        usecase.execute(
          { id: '75c791ca-7a40-4217-8b99-2cf22c01d543' },
          policieService,
          token
        )
      ).rejects.toThrow('Evaluation not found');
      expect(evaluationRepository.find).toHaveBeenCalledWith(
        '75c791ca-7a40-4217-8b99-2cf22c01d543'
      );
      expect(evaluationRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should delete an evaluation', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(evaluation);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new DeleteEvaluation(evaluationRepository);
      const result = await usecase.execute(
        {
          id: evaluation.id.value,
        },
        policieService,
        token
      );

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        evaluation.id.value
      );
      expect(evaluationRepository.delete).toHaveBeenCalledWith(
        evaluation.id.value
      );
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
