import MemoryAuthUserRepository from '../../infrastructure/repositories/memory-repository/user.repository';
import AuthUserFacade from '../facade/facade/user.facade';
import CreateAuthUser from '../usecases/authUser/create-user.usecase';
import DeleteAuthUser from '../usecases/authUser/delete-user.usecase';
import FindAuthUser from '../usecases/authUser/find-user.usecase';
import UpdateAuthUser from '../usecases/authUser/update-user.usecase';
import LoginAuthUser from '../usecases/authUser/login-user.usecase';
import AuthUserService from '../service/user-entity.service';
import TokenService from '../../../@shared/infraestructure/service/token.service';

/**
 * Factory responsible for creating AuthUserFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class AuthUserFacadeFactory {
  /**
   * Creates an instance of AuthUserFacade with all dependencies properly configured
   * @returns Fully configured AuthUserFacade instance
   */
  static create(): AuthUserFacade {
    const repository = new MemoryAuthUserRepository();
    const authUserService = new AuthUserService();
    const tokenService = new TokenService('PxHf3H7');

    const createAuthUser = new CreateAuthUser(repository, authUserService);
    const deleteAuthUser = new DeleteAuthUser(repository);
    const findAuthUser = new FindAuthUser(repository);
    const updateAuthUser = new UpdateAuthUser(repository, authUserService);
    const loginAuthUser = new LoginAuthUser(
      repository,
      authUserService,
      tokenService
    );

    const facade = new AuthUserFacade({
      createAuthUser,
      deleteAuthUser,
      findAuthUser,
      updateAuthUser,
      loginAuthUser,
    });

    return facade;
  }
}
