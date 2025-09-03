import MemoryAuthUserRepository from '../../infrastructure/repositories/memory-repository/user.repository';
import AuthUserFacade from '../facade/facade/user.facade';
import CreateAuthUser from '../usecases/authUser/create-user.usecase';
import DeleteAuthUser from '../usecases/authUser/delete-user.usecase';
import FindAuthUser from '../usecases/authUser/find-user.usecase';
import UpdateAuthUser from '../usecases/authUser/update-user.usecase';
import LoginAuthUser from '../usecases/authUser/login-user.usecase';
import { AuthUserService } from '../../infrastructure/services/user-entity.service';
import TokenService from '../../infrastructure/services/token.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryTenantRepository from '../../infrastructure/repositories/memory-repository/tenant.repository';
import { TenantService } from '../../domain/service/tenant.service';

/**
 * Factory responsible for creating AuthUserFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class AuthUserFacadeFactory {
  /**
   * Creates an instance of AuthUserFacade with all dependencies properly configured
   * @returns Fully configured AuthUserFacade instance
   */
  static create(secret: string): AuthUserFacade {
    const authUserService = new AuthUserService();
    const authUserRepository = new MemoryAuthUserRepository(authUserService);
    const tenantRepository = new MemoryTenantRepository();
    const tenantService = new TenantService(tenantRepository);
    const tokenService = new TokenService(secret);
    const policiesService = new PoliciesService();

    const createAuthUser = new CreateAuthUser(
      authUserRepository,
      tenantRepository,
      authUserService,
      tenantService,
      policiesService
    );
    const deleteAuthUser = new DeleteAuthUser(authUserRepository, policiesService);
    const findAuthUser = new FindAuthUser(authUserRepository, policiesService);
    const updateAuthUser = new UpdateAuthUser(
      authUserRepository,
      tenantRepository,
      authUserService,
      tenantService,
      policiesService
    );
    const loginAuthUser = new LoginAuthUser(
      authUserRepository,
      authUserService,
      tokenService,
      tenantService
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
