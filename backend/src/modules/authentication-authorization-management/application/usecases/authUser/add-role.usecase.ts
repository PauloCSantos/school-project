import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';
import { AddRoleInputDto } from '../../dto/user-usecase.dto';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import { toRoleType } from '@/modules/@shared/utils/formatting';
import { AcessDeniedError } from '@/modules/@shared/application/errors/access-denied.error';
import { AuthUserNotFoundError } from '../../errors/auth-user-not-found.error';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
  RoleUsersEnum,
} from '@/modules/@shared/enums/enums';

export default class AddRole implements UseCaseInterface<AddRoleInputDto, void> {
  constructor(
    private readonly authUserRepository: AuthUserGateway,
    private readonly tenantRepository: TenantGateway,
    private readonly tenantService: TenantServiceInterface,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  async execute({ email, role }: AddRoleInputDto, token: TokenData): Promise<void> {
    toRoleType(role);

    if (role === RoleUsersEnum.MASTER) {
      throw new AcessDeniedError('Unable to add this function');
    }

    await this.policiesService.verifyPolicies(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.ADD,
      token,
      { targetRole: role }
    );

    const authUser = await this.authUserRepository.find(email);

    if (!authUser) {
      throw new AuthUserNotFoundError(email);
    }

    const tenant = await this.tenantService.getTenant(token.masterId);
    tenant.addTenantUserRole(email, role);

    await this.tenantRepository.update(tenant.id, tenant);
  }
}
