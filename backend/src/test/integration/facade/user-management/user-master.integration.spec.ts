import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';

import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryMasterRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/master.repository';

import {
  AuthUserService,
  AuthUserServiceInterface,
} from '@/modules/authentication-authorization-management/application/service/user-entity.service';

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
import TokenService from '@/modules/@shared/infraestructure/services/token.service';
import TokenServiceInterface from '@/modules/@shared/infraestructure/services/token.service';
import {
  PoliciesService,
  PoliciesServiceInterface,
} from '@/modules/@shared/application/services/policies.service';

describe('User master facade integration test', () => {
  let authUserRepository: MemoryAuthUserRepository;
  let masterRepository: MemoryMasterRepository;
  let emailAuthValidator: EmailAuthValidatorService;
  let authUserService: AuthUserServiceInterface;
  let tokenService: TokenServiceInterface;
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
    role: 'master',
  };

  async function createAuthUserFor(email: string) {
    await facadeAuthUser.create(
      {
        email,
        password: 'XpA2Jjd4',
        masterId: new Id().value,
        role: 'master' as RoleUsers,
      },
      token
    );
  }

  beforeEach(() => {
    authUserRepository = new MemoryAuthUserRepository();
    masterRepository = new MemoryMasterRepository();
    emailAuthValidator = new EmailAuthValidatorService(authUserRepository);

    authUserService = new AuthUserService();
    tokenService = new TokenService('PxHf3H7');

    createAuthUser = new CreateAuthUser(authUserRepository, authUserService);
    deleteAuthUser = new DeleteAuthUser(authUserRepository);
    findAuthUser = new FindAuthUser(authUserRepository);
    updateAuthUser = new UpdateAuthUser(authUserRepository, authUserService);
    loginAuthUser = new LoginAuthUser(
      authUserRepository,
      authUserService,
      tokenService
    );
    policiesService = new PoliciesService();

    facadeAuthUser = new AuthUserFacade({
      createAuthUser,
      findAuthUser,
      updateAuthUser,
      deleteAuthUser,
      loginAuthUser,
      policiesService,
    });

    createUserMaster = new CreateUserMaster(
      masterRepository,
      emailAuthValidator
    );
    findUserMaster = new FindUserMaster(masterRepository);
    updateUserMaster = new UpdateUserMaster(masterRepository);

    facadeMaster = new MasterFacade({
      createUserMaster,
      findUserMaster,
      updateUserMaster,
      policiesService,
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
});
