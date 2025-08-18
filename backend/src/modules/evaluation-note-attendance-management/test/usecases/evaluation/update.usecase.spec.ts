import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import UpdateEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/update.usecase';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import EvaluationGateway from '@/modules/evaluation-note-attendance-management/application/gateway/evaluation.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('updateEvaluation usecase unit test', () => {
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
      evaluationRepository.find.mockResolvedValue(null);

      const usecase = new UpdateEvaluation(
        evaluationRepository,
        policieService
      );

      await expect(
        usecase.execute(
          {
            ...input,
            id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
          },
          token
        )
      ).rejects.toThrow('Evaluation not found');

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        token.masterId,
        '75c791ca-7a40-4217-8b99-2cf22c01d543'
      );
      expect(evaluationRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should update an evaluation', async () => {
      const evaluationRepository = MockRepository();
      evaluationRepository.find.mockResolvedValue(evaluation1);
      evaluationRepository.update.mockResolvedValue(evaluation1);

      const usecase = new UpdateEvaluation(
        evaluationRepository,
        policieService
      );

      const result = await usecase.execute(
        {
          id: evaluation1.id.value,
          ...input,
        },
        token
      );

      expect(evaluationRepository.find).toHaveBeenCalledWith(
        token.masterId,
        evaluation1.id.value
      );
      expect(evaluationRepository.update).toHaveBeenCalledWith(
        token.masterId,
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
