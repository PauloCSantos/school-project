import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
} from '@/modules/@shared/enums/enums';

describe('DeleteAuthUser Use Case', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let policiesService: jest.Mocked<PoliciesServiceInterface>;
  let usecase: DeleteAuthUser;
  let input: { email: string };
  let token: TokenData;
  let existingUser: AuthUser;

  const MockRepository = (): jest.Mocked<AuthUserGateway> => ({
    find: jest.fn(),
    create: jest.fn(),
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
    policiesService = MockPolicyService();
    usecase = new DeleteAuthUser(repository, policiesService);

    input = { email: 'test@example.com' };
    token = {
      masterId: 'user-id',
      role: RoleUsersEnum.ADMINISTRATOR,
      email: 'admin@example.com',
    };

    existingUser = new AuthUser(
      {
        email: input.email,
        password: 'hashed_password',
      },
      MockAuthUserService()
    );
  });

  it('should throw ACCESS_DENIED when policies are not permitted', async () => {
    policiesService.verifyPolicies.mockRejectedValueOnce(
      new Error('User does not have access permission')
    );

    await expect(usecase.execute(input, token)).rejects.toThrow(
      ErrorMessage.ACCESS_DENIED
    );

    expect(policiesService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.DELETE,
      token
    );
    expect(repository.find).not.toHaveBeenCalled();
  });

  it('should throw an error if the authUser does not exist', async () => {
    repository.delete.mockRejectedValueOnce(new Error('AuthUser not found'));

    await expect(usecase.execute(input, token)).rejects.toThrow('AuthUser not found');
  });

  it('should delete an authUser successfully', async () => {
    repository.find.mockResolvedValueOnce(existingUser);
    repository.delete.mockResolvedValueOnce('Operação concluída com sucesso');

    const result = await usecase.execute(input, token);

    expect(policiesService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.DELETE,
      token
    );
    expect(repository.delete).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Operação concluída com sucesso' });
  });
});
