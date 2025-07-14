import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import { CreateAuthUserInputDto } from '@/modules/authentication-authorization-management/application/dto/user-usecase.dto';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/type/sharedTypes';

describe('CreateAuthUser Use Case', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let authUserService: jest.Mocked<AuthUserServiceInterface>;
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let usecase: CreateAuthUser;
  let input: CreateAuthUserInputDto;

  const makeDefaultInput = (): CreateAuthUserInputDto => ({
    email: 'test@domain.com',
    password: 'Pass123!',
    role: 'master',
  });

  const MockRepository = (): jest.Mocked<AuthUserGateway> => ({
    find: jest.fn(),
    create: jest.fn(async authUser => ({
      email: authUser.email,
      masterId: authUser.masterId,
    })),
    update: jest.fn(),
    delete: jest.fn(),
    verify: jest.fn(),
  });

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });

  const MockAuthUserService = (): jest.Mocked<AuthUserServiceInterface> => {
    return {
      generateHash: jest.fn<Promise<string>, [string]>(
        async password => `hashed_${password}`
      ),
      comparePassword: jest.fn<Promise<boolean>, [string, string]>(
        async (plain, hash) => `hashed_${plain}` === hash
      ),
    };
  };

  beforeEach(() => {
    repository = MockRepository();
    authUserService = MockAuthUserService();
    policieService = MockPolicyService();
    usecase = new CreateAuthUser(repository, authUserService);
    input = makeDefaultInput();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw access denied if policy denies', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(false);
    input.role = 'administrator';
    await expect(usecase.execute(input, policieService)).rejects.toThrow(
      'User does not have access permission'
    );

    expect(policieService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.CREATE,
      undefined,
      { targetRole: input.role }
    );
  });

  it('should create a user and return the result when permitted', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce(null);

    const output = await usecase.execute(input, policieService);

    expect(authUserService.generateHash).toHaveBeenCalledWith(input.password);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        _email: input.email,
        _role: input.role,
        _isHashed: true,
      })
    );
    expect(output.email).toBe(input.email);
    expect(output.masterId).toBeDefined();
    expect(typeof output.masterId).toBe('string');
  });

  it('should throw if user already exists', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce({ email: input.email } as any);

    await expect(usecase.execute(input, policieService)).rejects.toThrow(
      'AuthUser already exists'
    );

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should propagate hash errors and not call create', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce(null);
    authUserService.generateHash.mockRejectedValueOnce(
      new Error('User does not have access permission')
    );

    await expect(usecase.execute(input, policieService)).rejects.toThrow(
      'User does not have access permission'
    );
    expect(repository.create).not.toHaveBeenCalled();
  });
});
