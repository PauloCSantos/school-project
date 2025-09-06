import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';

import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryMasterRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/master.repository';

import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';

import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import AuthUserFacade from '@/modules/authentication-authorization-management/application/facade/facade/user.facade';

import CreateUserMaster from '@/modules/user-management/application/usecases/master/createUserMaster.usecase';

import FindUserMaster from '@/modules/user-management/application/usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '@/modules/user-management/application/usecases/master/updateUserMaster.usecase';
import MasterFacade from '@/modules/user-management/application/facade/facade/master.facade';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import TokenServiceInterface from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import {
  PoliciesService,
  PoliciesServiceInterface,
} from '@/modules/@shared/application/services/policies.service';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';
import {
  TenantService,
  TenantServiceInterface,
} from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import MemoryTenantRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/tenant.repository';
import UserGateway from '@/modules/user-management/application/gateway/user.gateway';
import {
  UserService,
  UserServiceInterface,
} from '@/modules/user-management/domain/services/user.service';
import MemoryUserRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/user.repository';
import FindUserMasterByBaseUser from '@/modules/user-management/application/usecases/master/findUserMasterByBaseUser.usecase';

describe('User master facade integration test', () => {
  let authUserRepository: AuthUserGateway;
  let tenantRepository: TenantGateway;
  let masterRepository: UserMasterGateway;
  let userRepository: UserGateway;
  let emailAuthValidator: EmailAuthValidatorService;
  let authUserService: AuthUserServiceInterface;
  let tenantService: TenantServiceInterface;
  let tokenService: TokenServiceInterface;
  let userService: UserServiceInterface;
  let createAuthUser: CreateAuthUser;
  let deleteAuthUser: DeleteAuthUser;
  let findAuthUser: FindAuthUser;
  let updateAuthUser: UpdateAuthUser;
  let loginAuthUser: LoginAuthUser;
  let facadeAuthUser: AuthUserFacade;
  let policiesService: PoliciesServiceInterface;

  let createUserMaster: CreateUserMaster;
  let findUserMaster: FindUserMaster;
  let updateUserMaster: UpdateUserMaster;
  let findUserMasterByBaseUser: FindUserMasterByBaseUser;
  let facadeMaster: MasterFacade;

  const input = {
    id: new Id().value,
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: {
      street: 'Street A',
      city: 'City A',
      zip: '111111-111',
      number: 1,
      avenue: 'Avenue A',
      state: 'State A',
    },
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    cnpj: '35.741.901/0001-58',
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: RoleUsersEnum.MASTER,
  };

  async function createAuthUserFor(email: string) {
    await facadeAuthUser.createTenant({
      email,
      password: 'XpA2Jjd4',
      role: 'master' as RoleUsers,
      cnpj: '12345678000195',
    });
  }

  beforeEach(() => {
    authUserService = new AuthUserService();
    authUserRepository = new MemoryAuthUserRepository(authUserService);
    masterRepository = new MemoryMasterRepository();
    tenantRepository = new MemoryTenantRepository();
    userRepository = new MemoryUserRepository();

    emailAuthValidator = new EmailAuthValidatorService(authUserRepository);
    tenantService = new TenantService(tenantRepository);
    tokenService = new TokenService('secretkey');
    userService = new UserService(userRepository);

    policiesService = new PoliciesService();
    createAuthUser = new CreateAuthUser(
      authUserRepository,
      tenantRepository,
      authUserService,
      tenantService,
      policiesService
    );
    deleteAuthUser = new DeleteAuthUser(authUserRepository, policiesService);
    findAuthUser = new FindAuthUser(authUserRepository, policiesService);
    updateAuthUser = new UpdateAuthUser(
      authUserRepository,
      tenantRepository,
      authUserService,
      tenantService,
      policiesService
    );
    loginAuthUser = new LoginAuthUser(
      authUserRepository,
      authUserService,
      tokenService,
      tenantService
    );
    policiesService = new PoliciesService();

    facadeAuthUser = new AuthUserFacade({
      createAuthUser,
      findAuthUser,
      updateAuthUser,
      deleteAuthUser,
      loginAuthUser,
    });

    createUserMaster = new CreateUserMaster(
      masterRepository,
      emailAuthValidator,
      policiesService,
      userService
    );
    findUserMaster = new FindUserMaster(masterRepository, policiesService, userService);
    updateUserMaster = new UpdateUserMaster(
      masterRepository,
      policiesService,
      userService
    );
    findUserMasterByBaseUser = new FindUserMasterByBaseUser(masterRepository);

    facadeMaster = new MasterFacade({
      createUserMaster,
      findUserMaster,
      updateUserMaster,
      findUserMasterByBaseUser,
    });
  });

  it('should create a Master user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeMaster.create(input, token);

    expect(result.id).toBeDefined();
  });

  it('should find a Master user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeMaster.create(input, token);
    const userMaster = await facadeMaster.find(result, token);

    expect(userMaster).toBeDefined();
  });

  it('should update a Master user using the facade', async () => {
    await createAuthUserFor(input.email);
    const id = await facadeMaster.create(input, token);

    const result = await facadeMaster.update(
      {
        id: id.id,
        address: {
          street: 'Street B',
          city: 'City B',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should find a Master by user id using the facade', async () => {
    await createAuthUserFor(input.email);
    await facadeMaster.create(input, token);
    const userMaster = await facadeMaster.checkUserMasterFromToken(token);

    expect(userMaster).toBeDefined();
  });
});
