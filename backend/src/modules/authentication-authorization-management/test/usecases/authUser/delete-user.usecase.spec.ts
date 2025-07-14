import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import AuthUserGateway from '@/modules/authentication-authorization-management/infrastructure/gateway/user.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
  ErrorMessage,
  RoleUsersEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('DeleteAuthUser Use Case', () => {
  let repository: jest.Mocked<AuthUserGateway>;
  let policieService: jest.Mocked<PoliciesServiceInterface>;
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
    policieService = MockPolicyService();
    usecase = new DeleteAuthUser(repository);

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
        masterId: new Id().value,
        role: RoleUsersEnum.STUDENT,
      },
      MockAuthUserService()
    );
  });

  it('should throw ACCESS_DENIED when policies are not permitted', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(false);

    await expect(usecase.execute(input, policieService, token)).rejects.toThrow(
      ErrorMessage.ACCESS_DENIED
    );

    expect(policieService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.DELETE,
      token
    );
    expect(repository.find).not.toHaveBeenCalled();
  });

  it('should throw an error if the authUser does not exist', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce(null);

    await expect(usecase.execute(input, policieService, token)).rejects.toThrow(
      'User not found'
    );

    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('should delete an authUser successfully', async () => {
    policieService.verifyPolicies.mockResolvedValueOnce(true);
    repository.find.mockResolvedValueOnce(existingUser);
    repository.delete.mockResolvedValueOnce('Operação concluída com sucesso');

    const result = await usecase.execute(input, policieService, token);

    expect(policieService.verifyPolicies).toHaveBeenCalledWith(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.DELETE,
      token
    );
    expect(repository.find).toHaveBeenCalledWith(input.email);
    expect(repository.delete).toHaveBeenCalledWith(input.email);
    expect(result).toEqual({ message: 'Operação concluída com sucesso' });
  });
});
