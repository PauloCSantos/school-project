import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/find.usecase';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/application/gateway/evaluation.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('findEvaluation usecase unit test', () => {
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
    role: RoleUsersEnum.MASTER,
    masterId: new Id().value,
  };
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

      const usecase = new FindEvaluation(evaluationRepository, policieService);

      const result = await usecase.execute({ id: evaluation1.id.value }, token);

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        token.masterId,
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

    it('should return null when id is not found', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(null);

      const usecase = new FindEvaluation(evaluationRepository, policieService);
      const result = await usecase.execute(
        {
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        },
        token
      );

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        token.masterId,
        '75c791ca-7a40-4217-8b99-2cf22c01d543'
      );
      expect(result).toBeNull();
    });
  });
});
