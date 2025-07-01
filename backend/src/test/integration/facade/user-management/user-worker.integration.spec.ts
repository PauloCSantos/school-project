import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsers } from '@/modules/@shared/type/enum';

import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryWorkerRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/worker.repository';

import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import AuthUserFacade from '@/modules/authentication-authorization-management/application/facade/facade/user.facade';

import CreateUserWorker from '@/modules/user-management/application/usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '@/modules/user-management/application/usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '@/modules/user-management/application/usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '@/modules/user-management/application/usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '@/modules/user-management/application/usecases/worker/updateUserWorker.usecase';
import WorkerFacade from '@/modules/user-management/application/facade/facade/worker.facade';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import TokenService from '@/modules/@shared/infraestructure/service/token.service';

describe('User Worker facade integration test', () => {
  let authUserRepository: MemoryAuthUserRepository;
  let workerRepository: MemoryWorkerRepository;
  let emailAuthValidator: EmailAuthValidatorService;
  let authUserService: AuthUserService;
  let tokenService: TokenService;
  let createAuthUser: CreateAuthUser;
  let deleteAuthUser: DeleteAuthUser;
  let findAuthUser: FindAuthUser;
  let updateAuthUser: UpdateAuthUser;
  let loginAuthUser: LoginAuthUser;
  let facadeAuthUser: AuthUserFacade;

  let createUserWorker: CreateUserWorker;
  let deleteUserWorker: DeleteUserWorker;
  let findAllUserWorker: FindAllUserWorker;
  let findUserWorker: FindUserWorker;
  let updateUserWorker: UpdateUserWorker;
  let facadeWorker: WorkerFacade;

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
  };

  async function createAuthUserFor(email: string) {
    await facadeAuthUser.create({
      email,
      password: 'XpA2Jjd4',
      masterId: new Id().value,
      role: 'master' as RoleUsers,
      isHashed: false,
    });
  }

  beforeEach(() => {
    // Always use fresh instances for each test for isolation
    authUserRepository = new MemoryAuthUserRepository();
    workerRepository = new MemoryWorkerRepository();
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

    facadeAuthUser = new AuthUserFacade({
      createAuthUser,
      findAuthUser,
      updateAuthUser,
      deleteAuthUser,
      loginAuthUser,
    });

    createUserWorker = new CreateUserWorker(
      workerRepository,
      emailAuthValidator
    );
    deleteUserWorker = new DeleteUserWorker(workerRepository);
    findAllUserWorker = new FindAllUserWorker(workerRepository);
    findUserWorker = new FindUserWorker(workerRepository);
    updateUserWorker = new UpdateUserWorker(workerRepository);

    facadeWorker = new WorkerFacade({
      createUserWorker,
      deleteUserWorker,
      findAllUserWorker,
      findUserWorker,
      updateUserWorker,
    });
  });

  it('should create a Worker user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeWorker.create(input);

    expect(result.id).toBeDefined();
  });

  it('should find a Worker user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeWorker.create(input);
    const userWorker = await facadeWorker.find(result);

    expect(userWorker).toBeDefined();
  });

  it('should find all Worker users using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeWorker.create(input);
    await facadeWorker.create(input2);
    await facadeWorker.create(input3);
    const allUsers = await facadeWorker.findAll({});

    expect(allUsers.length).toBe(3);
  });

  it('should delete a Worker user using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeWorker.create(input);
    const id2 = await facadeWorker.create(input2);
    await facadeWorker.create(input3);
    const result = await facadeWorker.delete({ id: id2.id });
    const allUsers = await facadeWorker.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });

  it('should update a Worker user using the facade', async () => {
    await createAuthUserFor(input.email);
    const id = await facadeWorker.create(input);

    const result = await facadeWorker.update({
      id: id.id,
      address: {
        street: 'Street B',
        city: 'City B',
        zip: '111111-111',
        number: 1,
        avenue: 'Avenue B',
        state: 'State B',
      },
    });

    expect(result).toBeDefined();
  });
});
