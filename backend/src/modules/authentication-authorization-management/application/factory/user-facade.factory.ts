import AuthUserFacade from '../facade/facade/user.facade';
import CreateAuthUser from '../usecases/authUser/create-user.usecase';
import DeleteAuthUser from '../usecases/authUser/delete-user.usecase';
import FindAuthUser from '../usecases/authUser/find-user.usecase';
import UpdateAuthUser from '../usecases/authUser/update-user.usecase';
import LoginAuthUser from '../usecases/authUser/login-user.usecase';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TenantServiceInterface } from '../../domain/service/tenant.service';
import AuthUserGateway from '../gateway/user.gateway';
import { AuthUserServiceInterface } from '../../domain/service/interface/user-entity-service.interface';
import TenantGateway from '../gateway/tenant.gateway';
import TokenServiceInterface from '../../domain/service/interface/token-service.interface';

/**
 * Factory responsible for creating AuthUserFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class AuthUserFacadeFactory {
  /**
   * Creates an instance of AuthUserFacade with all dependencies properly configured
   * @returns Fully configured AuthUserFacade instance
   */
  static create(
    authUserRepository: AuthUserGateway,
    authUserService: AuthUserServiceInterface,
    tenantRepository: TenantGateway,
    tenantService: TenantServiceInterface,
    tokenService: TokenServiceInterface,
    policiesService: PoliciesServiceInterface
  ): AuthUserFacade {
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
