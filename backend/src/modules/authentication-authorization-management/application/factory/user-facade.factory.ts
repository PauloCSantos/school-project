import MemoryAuthUserRepository from '../../infrastructure/repositories/user.repository';
import AuthUserFacade from '../facade/facade/user.facade';
import CreateAuthUser from '../usecases/authUser/create-user.usecase';
import DeleteAuthUser from '../usecases/authUser/delete-user.usecase';
import FindAuthUser from '../usecases/authUser/find-user.usecase';
import UpdateAuthUser from '../usecases/authUser/update-user.usecase';
import LoginAuthUser from '../usecases/authUser/login-user.usecase';
import AuthUserService from '../../domain/service/user-entity.service';

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
    // Currently using memory repository only
    // Future implementation will use environment variables to determine repository type
    const repository = new MemoryAuthUserRepository();
    const authUserService = new AuthUserService();

    // Create all required use cases
    const createAuthUser = new CreateAuthUser(repository, authUserService);
    const deleteAuthUser = new DeleteAuthUser(repository);
    const findAuthUser = new FindAuthUser(repository);
    const updateAuthUser = new UpdateAuthUser(repository);
    const loginAuthUser = new LoginAuthUser(repository);

    // Instantiate and return the facade with all required use cases
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
