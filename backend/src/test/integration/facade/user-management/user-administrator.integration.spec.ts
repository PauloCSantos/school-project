import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';

import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryAdministratorRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/administrator.repository';

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

import CreateUserAdministrator from '@/modules/user-management/application/usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/modules/user-management/application/usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/modules/user-management/application/usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/modules/user-management/application/usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/modules/user-management/application/usecases/administrator/updateUserAdministrator.usecase';
import AdministratorFacade from '@/modules/user-management/application/facade/facade/administrator.facade';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import TokenService from '@/modules/@shared/infraestructure/services/token.service';
import TokenServiceInterface from '@/modules/@shared/infraestructure/services/token.service';
import {
  PoliciesService,
  PoliciesServiceInterface,
} from '@/modules/@shared/application/services/policies.service';

describe('User Administrator facade integration test', () => {
  let authUserRepository: MemoryAuthUserRepository;
  let administratorRepository: MemoryAdministratorRepository;
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

  let createUserAdministrator: CreateUserAdministrator;
  let deleteUserAdministrator: DeleteUserAdministrator;
  let findAllUserAdministrator: FindAllUserAdministrator;
  let findUserAdministrator: FindUserAdministrator;
  let updateUserAdministrator: UpdateUserAdministrator;
  let facadeAdministrator: AdministratorFacade;

  const input = {
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
    salary: {
      salary: 5000,
    },
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    graduation: 'Math',
  };
  const input2 = {
    name: {
      firstName: 'Marie',
      lastName: 'Doe',
    },
    address: {
      street: 'Street B',
      city: 'City B',
      zip: '111111-111',
      number: 1,
      avenue: 'Bvenue B',
      state: 'State B',
    },
    salary: {
      salary: 8000,
    },
    birthday: new Date('11-12-1995'),
    email: 'teste2@test.com',
    graduation: 'Spanish',
  };
  const input3 = {
    name: {
      firstName: 'Paul',
      lastName: 'MCourtney',
    },
    address: {
      street: 'Street C',
      city: 'City C',
      zip: '111111-111',
      number: 1,
      avenue: 'Cvenue C',
      state: 'State C',
    },
    salary: {
      salary: 50000,
    },
    birthday: new Date('11-12-1995'),
    email: 'teste3@test.com',
    graduation: 'Japanese',
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
    administratorRepository = new MemoryAdministratorRepository();
    emailAuthValidator = new EmailAuthValidatorService(authUserRepository);

    authUserService = new AuthUserService();
    tokenService = new TokenService('PxHf3H7');

    policiesService = new PoliciesService();
    createAuthUser = new CreateAuthUser(authUserRepository, authUserService);
    deleteAuthUser = new DeleteAuthUser(authUserRepository);
    findAuthUser = new FindAuthUser(authUserRepository);
    updateAuthUser = new UpdateAuthUser(authUserRepository, authUserService);
    loginAuthUser = new LoginAuthUser(
      authUserRepository,
      authUserService,
      tokenService
    );

    facadeAuthUser = new AuthUserFacade({
      createAuthUser,
      findAuthUser,
      updateAuthUser,
      deleteAuthUser,
      loginAuthUser,
      policiesService,
    });

    createUserAdministrator = new CreateUserAdministrator(
      administratorRepository,
      emailAuthValidator
    );
    deleteUserAdministrator = new DeleteUserAdministrator(
      administratorRepository
    );
    findAllUserAdministrator = new FindAllUserAdministrator(
      administratorRepository
    );
    findUserAdministrator = new FindUserAdministrator(administratorRepository);
    updateUserAdministrator = new UpdateUserAdministrator(
      administratorRepository
    );

    facadeAdministrator = new AdministratorFacade({
      createUserAdministrator,
      deleteUserAdministrator,
      findAllUserAdministrator,
      findUserAdministrator,
      updateUserAdministrator,
      policiesService,
    });
  });

  it('should create an Administrator user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeAdministrator.create(input, token);

    expect(result.id).toBeDefined();
  });

  it('should find an Administrator user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeAdministrator.create(input, token);
    const userAdministrator = await facadeAdministrator.find(result, token);

    expect(userAdministrator).toBeDefined();
  });

  it('should find all Administrator users using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeAdministrator.create(input, token);
    await facadeAdministrator.create(input2, token);
    await facadeAdministrator.create(input3, token);
    const allUsers = await facadeAdministrator.findAll({}, token);

    expect(allUsers.length).toBe(3);
  });

  it('should delete an Administrator user using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeAdministrator.create(input, token);
    const id2 = await facadeAdministrator.create(input2, token);
    await facadeAdministrator.create(input3, token);
    const result = await facadeAdministrator.delete({ id: id2.id }, token);
    const allUsers = await facadeAdministrator.findAll({}, token);

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });

  it('should update an Administrator user using the facade', async () => {
    await createAuthUserFor(input.email);
    const id = await facadeAdministrator.create(input, token);

    const result = await facadeAdministrator.update(
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
