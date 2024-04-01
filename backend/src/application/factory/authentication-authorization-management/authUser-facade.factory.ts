import AuthUserFacade from '@/application/facade/authentication-authorization-management/facade/authUser.facade';
import CreateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/createAuthUser.usecase';
import DeleteAuthUser from '@/application/usecases/authentication-authorization-management/authUser/deleteAuthUser.usecase';
import FindAuthUser from '@/application/usecases/authentication-authorization-management/authUser/findAuthUser.usecase';
import UpdateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/updateAuthUser.usecase';
import MemoryAuthUserRepository from '@/infraestructure/repositories/authentication-authorization-management/authUser.repository';

export default class AuthUserFacadeFactory {
  static create(): AuthUserFacade {
    const repository = new MemoryAuthUserRepository();
    const createAuthUser = new CreateAuthUser(repository);
    const deleteAuthUser = new DeleteAuthUser(repository);
    const findAuthUser = new FindAuthUser(repository);
    const updateAuthUser = new UpdateAuthUser(repository);
    const facade = new AuthUserFacade({
      createAuthUser,
      deleteAuthUser,
      findAuthUser,
      updateAuthUser,
    });

    return facade;
  }
}
