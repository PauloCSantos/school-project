import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/application/service/user-entity.service';

describe('UpdateAuthUser Use Case', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let authUserService: jest.Mocked<AuthUserServiceInterface>;
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let usecase: UpdateAuthUser;
  let token: TokenData;
  let existingUser: AuthUser;
  let partialUpdate: {
    email: string;
  };
  let targetEmail: string;

  const MockRepository = (): jest.Mocked<AuthUserGateway> => ({
    find: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
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
    usecase = new UpdateAuthUser(repository, authUserService);

    targetEmail = 'olduser@example.com';
    partialUpdate = {
      email: 'newuser@example.com',
    };

    const id = new Id().value;
    token = {
      masterId: id,
      role: RoleUsersEnum.ADMINISTRATOR,
      email: 'admin@example.com',
    };

    existingUser = new AuthUser(
      {
        email: targetEmail,
        password: 'hashed_password',
        masterId: id,
        isHashed: true,
        role: RoleUsersEnum.STUDENT,
      },
      authUserService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw ACCESS_DENIED when policies are not permitted', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(false);

    await expect(
      usecase.execute(
        { email: existingUser.email, authUserDataToUpdate: partialUpdate },
        policieService,
        token
      )
    ).rejects.toThrow('User does not have access permission');

    expect(policieService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.UPDATE,
      token,
      { targetEmail }
    );
    expect(repository.find).not.toHaveBeenCalled();
  });

  it('should throw ENTITY_NOT_FOUND when the authUser does not exist', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce(null);

    await expect(
      usecase.execute(
        { email: existingUser.email, authUserDataToUpdate: partialUpdate },
        policieService,
        token
      )
    ).rejects.toThrow('AuthUser not found');

    expect(repository.find).toHaveBeenCalledWith(targetEmail);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('should update an authUser successfully', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce(existingUser);
    repository.update.mockResolvedValueOnce({
      email: partialUpdate.email,
      role: existingUser.role,
    } as any);

    const result = await usecase.execute(
      { email: existingUser.email, authUserDataToUpdate: partialUpdate },
      policieService,
      token
    );

    expect(policieService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.UPDATE,
      token,
      { targetEmail }
    );
    expect(repository.find).toHaveBeenCalledWith(targetEmail);
    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        _email: partialUpdate.email,
      }),
      targetEmail
    );
    expect(result).toEqual({
      email: partialUpdate.email,
      role: existingUser.role,
    });
  });

  it('should propagate update errors and not swallow them', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce(existingUser);
    repository.update.mockRejectedValueOnce(new Error('Update failure'));

    await expect(
      usecase.execute(
        { email: existingUser.email, authUserDataToUpdate: partialUpdate },
        policieService,
        token
      )
    ).rejects.toThrow('Update failure');
    expect(repository.update).toHaveBeenCalled();
  });
});
