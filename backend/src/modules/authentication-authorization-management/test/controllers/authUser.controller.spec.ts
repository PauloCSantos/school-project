import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateAuthUser from '../../application/usecases/authUser/createAuthUser.usecase';
import FindAuthUser from '../../application/usecases/authUser/findAuthUser.usecase';
import UpdateAuthUser from '../../application/usecases/authUser/updateAuthUser.usecase';
import DeleteAuthUser from '../../application/usecases/authUser/deleteAuthUser.usecase';
import LoginAuthUser from '../../application/usecases/authUser/loginAuthUser.usecase';
import AuthUserController from '../../interface/controller/authUser.controller';

describe('AuthUserController unit test', () => {
  const mockCreateAuthUser = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        email: 'teste1@teste.com',
        masterId: new Id().id,
      }),
    } as unknown as CreateAuthUser;
  });
  const mockFindAuthUser = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        email: 'teste1@teste.com',
        masterId: new Id().id,
        role: 'master',
        isHashed: true,
      }),
    } as unknown as FindAuthUser;
  });
  const mockUpdateAuthUser = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        email: 'teste1@teste.com',
        role: 'master',
      }),
    } as unknown as UpdateAuthUser;
  });
  const mockDeleteAuthUser = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteAuthUser;
  });
  const mockLoginAuthUser = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6Ijk1MzIwYWU4LWNjMDItNDEwMy1iZjZkLThlYjEwYjc3NWJhMSIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcwOTkyNDIyNiwiZXhwIjoxNzA5OTI2MDI2fQ.QCuJ6riJEe6m-7r-qkeZKI9JxvyVQJfNASHuc1GrVgg',
      }),
    } as unknown as LoginAuthUser;
  });

  const createAuthUser = mockCreateAuthUser();
  const deleteAuthUser = mockDeleteAuthUser();
  const findAuthUser = mockFindAuthUser();
  const updateAuthUser = mockUpdateAuthUser();
  const loginAuthUser = mockLoginAuthUser();

  const controller = new AuthUserController(
    createAuthUser,
    findAuthUser,
    updateAuthUser,
    deleteAuthUser,
    loginAuthUser
  );

  it('should return an email and masterId for the new authUser created', async () => {
    const result = await controller.create({
      email: 'teste@teste.com.br',
      password: 'XpA2Jjd4',
      masterId: new Id().id,
      role: 'master' as RoleUsers,
      isHashed: false,
    });

    expect(result.email).toBeDefined();
    expect(result.masterId).toBeDefined();
    expect(createAuthUser.execute).toHaveBeenCalled();
  });
  it('should find an authUser', async () => {
    const result = await controller.find({ email: 'teste@teste.com.br' });

    expect(result).toBeDefined();
    expect(findAuthUser.execute).toHaveBeenCalled();
  });
  it('should update an authUser', async () => {
    const result = await controller.update({
      email: 'teste@teste.com.br',
      authUserDataToUpdate: {
        password: 'as5d4v',
      },
    });

    expect(result).toBeDefined();
    expect(updateAuthUser.execute).toHaveBeenCalled();
  });
  it('should delete an authUser', async () => {
    const result = await controller.delete({
      email: 'teste@teste.com.br',
    });

    expect(result).toBeDefined();
    expect(deleteAuthUser.execute).toHaveBeenCalled();
  });
  it('should login and receive a token', async () => {
    const result = await controller.login({
      email: 'teste@teste.com.br',
      password: 'as5d4a5d4',
      role: 'master',
    });

    expect(result).toBeDefined();
    expect(deleteAuthUser.execute).toHaveBeenCalled();
  });
});
