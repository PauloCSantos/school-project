import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  RoleUsersEnum,
  TokenData,
  ModulesNameEnum,
  FunctionCalledEnum,
} from '@/modules/@shared/type/sharedTypes';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('FindAuthUser Use Case', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let usecase: FindAuthUser;
  let input: { email: string };
  let token: TokenData;

  const MockRepository = (): jest.Mocked<AuthUserGateway> =>
    ({
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      verify: jest.fn(),
    }) as jest.Mocked<AuthUserGateway>;

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  beforeEach(() => {
    repository = MockRepository();
    policieService = MockPolicyService();
    usecase = new FindAuthUser(repository);

    input = { email: 'test@example.com' };
    token = {
      email: 'caller@domain.com',
      role: RoleUsersEnum.MASTER,
      masterId: new Id().value,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw ACCESS_DENIED when policies are not permitted', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(false);

    await expect(usecase.execute(input, policieService, token)).rejects.toThrow(
      'User does not have access permission'
    );
    expect(policieService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.FIND,
      token,
      { targetEmail: input.email }
    );
    expect(repository.find).not.toHaveBeenCalled();
  });

  it('should return null when authUser is not found', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce(null);

    const result = await usecase.execute(input, policieService, token);

    expect(policieService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.FIND,
      token,
      { targetEmail: input.email }
    );
    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(result).toBeNull();
  });

  it('should return an authUser when it exists', async () => {
    const mockReturnedUser = {
      email: input.email,
      masterId: token.masterId,
      role: token.role,
      isHashed: true,
    };
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce(
      mockReturnedUser as unknown as ReturnType<typeof repository.find>
    );

    const result = await usecase.execute(input, policieService, token);

    expect(policieService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.FIND,
      token,
      { targetEmail: input.email }
    );
    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(result).toEqual(mockReturnedUser);
  });
});
