import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindAllEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/find-all.usecase';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/evaluation.gateway';

describe('findAllEvaluation usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = (): jest.Mocked<EvaluationGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  };

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  policieService = MockPolicyService();
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };

  const evaluation1 = new Evaluation({
    lesson: new Id().value,
    teacher: new Id().value,
    type: 'evaluation',
    value: 10,
  });
  const evaluation2 = new Evaluation({
    lesson: new Id().value,
    teacher: new Id().value,
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
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindAllEvaluation(evaluationRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(evaluationRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });

    it('should return an empty array when the repository is empty', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.findAll.mockResolvedValue([]);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindAllEvaluation(evaluationRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(evaluationRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });
  });
});
