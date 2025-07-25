import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
  DeleteAuthUserInputDto,
  DeleteAuthUserOutputDto,
  FindAuthUserInputDto,
  FindAuthUserOutputDto,
  LoginAuthUserInputDto,
  LoginAuthUserOutputDto,
  UpdateAuthUserInputDto,
  UpdateAuthUserOutputDto,
} from '../../application/dto/user-usecase.dto';
import CreateAuthUser from '../../application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '../../application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '../../application/usecases/authUser/find-user.usecase';
import LoginAuthUser from '../../application/usecases/authUser/login-user.usecase';
import UpdateAuthUser from '../../application/usecases/authUser/update-user.usecase';
import AuthUserController from '../../interface/controller/user.controller';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

const mockCreateAuthUser: jest.Mocked<CreateAuthUser> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateAuthUser>;

const mockFindAuthUser: jest.Mocked<FindAuthUser> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<FindAuthUser>;

const mockUpdateAuthUser: jest.Mocked<UpdateAuthUser> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<UpdateAuthUser>;

const mockDeleteAuthUser: jest.Mocked<DeleteAuthUser> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<DeleteAuthUser>;

const mockLoginAuthUser: jest.Mocked<LoginAuthUser> = {
  execute: jest.fn(),
} as unknown as jest.Mocked<LoginAuthUser>;

describe('AuthUserController unit test', () => {
  let controller: AuthUserController;
  let policieService: PoliciesServiceInterface;
  let token: TokenData;

  const masterId = new Id().value;
  const email = 'test@example.com';
  const password = 'password123';

  const createInput: CreateAuthUserInputDto = {
    email,
    password,
    masterId,
    role: 'master',
  };
  const createOutput: CreateAuthUserOutputDto = { email, masterId };

  const findInput: FindAuthUserInputDto = { email };
  const findOutput: FindAuthUserOutputDto = {
    email,
    masterId,
    role: 'master',
    isHashed: true,
  };

  const updateInput: UpdateAuthUserInputDto = {
    email,
    authUserDataToUpdate: { password: 'newPassword' },
  };
  const updateOutput: UpdateAuthUserOutputDto = {
    email,
    role: 'master',
  };

  const deleteInput: DeleteAuthUserInputDto = { email };
  const deleteOutput: DeleteAuthUserOutputDto = {
    message: 'Operação concluída com sucesso',
  };

  const loginInput: LoginAuthUserInputDto = {
    email,
    password,
    role: 'master',
  };
  const loginOutput: LoginAuthUserOutputDto = {
    token: 'mock_jwt_token_string',
  };
  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateAuthUser.execute.mockResolvedValue(createOutput);
    mockFindAuthUser.execute.mockResolvedValue(findOutput);
    mockUpdateAuthUser.execute.mockResolvedValue(updateOutput);
    mockDeleteAuthUser.execute.mockResolvedValue(deleteOutput);
    mockLoginAuthUser.execute.mockResolvedValue(loginOutput);
    policieService = MockPolicyService();

    controller = new AuthUserController(
      mockCreateAuthUser,
      mockFindAuthUser,
      mockUpdateAuthUser,
      mockDeleteAuthUser,
      mockLoginAuthUser,
      policieService
    );
  });

  it('should call create use case with correct input and return its output', async () => {
    const result = await controller.create(createInput, token);

    expect(mockCreateAuthUser.execute).toHaveBeenCalledTimes(1);
    expect(mockCreateAuthUser.execute).toHaveBeenCalledWith(
      createInput,
      policieService,
      token
    );
    expect(result).toEqual(createOutput);
  });

  it('should call find use case with correct input and return its output', async () => {
    const result = await controller.find(findInput, token);

    expect(mockFindAuthUser.execute).toHaveBeenCalledTimes(1);
    expect(mockFindAuthUser.execute).toHaveBeenCalledWith(
      findInput,
      policieService,
      token
    );
    expect(result).toEqual(findOutput);
  });

  it('should handle case where find use case returns null', async () => {
    mockFindAuthUser.execute.mockResolvedValue(null);

    const result = await controller.find(findInput, token);

    expect(mockFindAuthUser.execute).toHaveBeenCalledTimes(1);
    expect(mockFindAuthUser.execute).toHaveBeenCalledWith(
      findInput,
      policieService,
      token
    );
    expect(result).toBeNull();
  });

  it('should call update use case with correct input and return its output', async () => {
    const result = await controller.update(updateInput, token);

    expect(mockUpdateAuthUser.execute).toHaveBeenCalledTimes(1);
    expect(mockUpdateAuthUser.execute).toHaveBeenCalledWith(
      updateInput,
      policieService,
      token
    );
    expect(result).toEqual(updateOutput);
  });

  it('should call delete use case with correct input and return its output', async () => {
    const result = await controller.delete(deleteInput, token);

    expect(mockDeleteAuthUser.execute).toHaveBeenCalledTimes(1);
    expect(mockDeleteAuthUser.execute).toHaveBeenCalledWith(
      deleteInput,
      policieService,
      token
    );
    expect(result).toEqual(deleteOutput);
  });

  it('should call login use case with correct input and return its output', async () => {
    const result = await controller.login(loginInput);

    expect(mockLoginAuthUser.execute).toHaveBeenCalledTimes(1);
    expect(mockLoginAuthUser.execute).toHaveBeenCalledWith(loginInput);
    expect(result).toEqual(loginOutput);
  });
});
