import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateAuthUserInputDto,
  UpdateAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';

import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import TenantGateway from '../../gateway/tenant.gateway';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import { AuthUserNotFoundError } from '../../errors/authUser-not-found.error';

/**
 * Use case responsible for updating an authenticated user.
 *
 * Verifies user existence, applies updates, and persists changes.
 */
export default class UpdateAuthUser
  implements UseCaseInterface<UpdateAuthUserInputDto, UpdateAuthUserOutputDto>
{
  /**
   * Constructs a new instance of the UpdateAuthUser use case.
   *
   * @param authUserRepository - Gateway implementation for data persistence
   * @param authUserService - Domain service for user-related logic
   */
  constructor(
    private readonly authUserRepository: AuthUserGateway,
    private readonly tenantRepository: TenantGateway,
    private readonly authUserService: AuthUserServiceInterface,
    private readonly tenantService: TenantServiceInterface,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  /**
   * Executes the update of an authenticated user.
   *
   * @param input - Input data containing the user email and fields to update
   * @returns Output data of the updated user
   * @throws Error if the user with the specified email does not exist
   * @throws ValidationError if any of the updated data fails validation
   */
  async execute(
    { email, authUserDataToUpdate }: UpdateAuthUserInputDto,
    token: TokenData
  ): Promise<UpdateAuthUserOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.UPDATE,
      token,
      { targetEmail: email }
    );

    const existingUser = await this.authUserRepository.find(email);
    if (!existingUser) {
      throw new AuthUserNotFoundError(email);
    }

    const authUser = new AuthUser(
      {
        email: existingUser.email,
        password: existingUser.password,
        isHashed: existingUser.isHashed,
      },
      this.authUserService
    );

    const tenant = await this.tenantService.getTenant(token.masterId);

    if (authUserDataToUpdate.email !== undefined) {
      tenant.renameUserEmail(authUser.email, authUserDataToUpdate.email);
      authUser.email = authUserDataToUpdate.email;
    }
    let role = token.role;
    if (authUserDataToUpdate.role !== undefined) {
      tenant.changeTenantUserRole(authUser.email, token.role, authUserDataToUpdate.role);
      role = authUserDataToUpdate.role;
    }

    if (authUserDataToUpdate.password !== undefined) {
      authUser.password = authUserDataToUpdate.password;
      await authUser.hashPassword();
    }

    if (authUser.isPending) {
      authUser.markVerified();
    }

    const result = await this.authUserRepository.update(authUser, email);
    await this.tenantRepository.update(token.masterId, tenant);

    return {
      email: result.email,
      role: role,
    };
  }
}
