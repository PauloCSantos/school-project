import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateAuthUserInputDto,
  CreateAuthUserOutputDto,
} from '../../dto/user-usecase.dto';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

import { FunctionCalledEnum, ModulesNameEnum } from '@/modules/@shared/enums/enums';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import { TenantServiceInterface } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import { toRoleType } from '@/modules/@shared/utils/formatting';
import { ConflictError } from '@/modules/@shared/application/errors/conflict.error';
import { MissingCnpjTokenError } from '../../errors/missing-cnpj-token.error';

export default class CreateAuthUser
  implements UseCaseInterface<CreateAuthUserInputDto, CreateAuthUserOutputDto>
{
  constructor(
    private readonly authUserRepository: AuthUserGateway,
    private readonly tenantRepository: TenantGateway,
    private readonly authUserService: AuthUserServiceInterface,
    private readonly tenantService: TenantServiceInterface,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  async execute(
    { email, password, role, cnpj }: CreateAuthUserInputDto,
    token?: TokenData
  ): Promise<CreateAuthUserOutputDto> {
    toRoleType(role);
    let masterId = token?.masterId;

    if (!cnpj && !masterId) {
      throw new MissingCnpjTokenError(
        'It is necessary to inform CNPJ or be authenticated'
      );
    }

    await this.policiesService.verifyPolicies(
      ModulesNameEnum.AUTHUSER,
      FunctionCalledEnum.CREATE,
      token,
      { targetRole: role }
    );

    const existingUser = await this.authUserRepository.find(email);

    let authUser: AuthUser;
    let userCreated = false;

    if (existingUser) {
      const passwordMatches = await existingUser.comparePassword(password);
      if (!passwordMatches) {
        throw new ConflictError('E-mail in use');
      }
      authUser = existingUser;
    } else {
      authUser = new AuthUser({ email, password }, this.authUserService);
      await authUser.hashPassword();
      userCreated = true;
    }

    const { tenant, isNew } = await this.tenantService.manageUserRoleAssignmentInTenant({
      masterId,
      email,
      role,
      cnpj,
    });

    if (userCreated) {
      await this.authUserRepository.create(authUser);
    }

    if (isNew) {
      await this.tenantRepository.create(tenant);
    } else {
      await this.tenantRepository.update(tenant.id, tenant);
    }

    const result: CreateAuthUserOutputDto = {
      email: authUser.email,
      masterId: tenant.id,
    };

    return result;
  }
}
