import MemoryAuthUserRepository from '../../infrastructure/repositories/authUser.repository';
import AuthUserFacade from '../facade/facade/authUser.facade';
import CreateAuthUser from '../usecases/authUser/createAuthUser.usecase';
import DeleteAuthUser from '../usecases/authUser/deleteAuthUser.usecase';
import FindAuthUser from '../usecases/authUser/findAuthUser.usecase';
import UpdateAuthUser from '../usecases/authUser/updateAuthUser.usecase';

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
