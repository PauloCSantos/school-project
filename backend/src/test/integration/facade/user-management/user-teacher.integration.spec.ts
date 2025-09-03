import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';

import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryTeacherRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/teacher.repository';

import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import AuthUserFacade from '@/modules/authentication-authorization-management/application/facade/facade/user.facade';

import CreateUserTeacher from '@/modules/user-management/application/usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '@/modules/user-management/application/usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '@/modules/user-management/application/usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '@/modules/user-management/application/usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '@/modules/user-management/application/usecases/teacher/updateUserTeacher.usecase';
import TeacherFacade from '@/modules/user-management/application/facade/facade/teacher.facade';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import TokenServiceInterface from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import {
  PoliciesService,
  PoliciesServiceInterface,
} from '@/modules/@shared/application/services/policies.service';
import { AuthUserServiceInterface } from '@/modules/authentication-authorization-management/domain/service/interface/user-entity-service.interface';
import AuthUserGateway from '@/modules/authentication-authorization-management/application/gateway/user.gateway';
import UserTeacherGateway from '@/modules/user-management/application/gateway/teacher.gateway';
import TenantGateway from '@/modules/authentication-authorization-management/application/gateway/tenant.gateway';
import {
  TenantService,
  TenantServiceInterface,
} from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import MemoryTenantRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/tenant.repository';
import UserGateway from '@/modules/user-management/application/gateway/user.gateway';
import {
  UserService,
  UserServiceInterface,
} from '@/modules/user-management/domain/services/user.service';
import MemoryUserRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/user.repository';

describe('User Teacher facade integration test', () => {
  let authUserRepository: AuthUserGateway;
  let tenantRepository: TenantGateway;
  let teacherRepository: UserTeacherGateway;
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

  let createUserTeacher: CreateUserTeacher;
  let deleteUserTeacher: DeleteUserTeacher;
  let findAllUserTeacher: FindAllUserTeacher;
  let findUserTeacher: FindUserTeacher;
  let updateUserTeacher: UpdateUserTeacher;
  let facadeTeacher: TeacherFacade;

  let policiesService: PoliciesServiceInterface;

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
    academicDegrees: 'Msc',
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
    academicDegrees: 'Msc',
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
    academicDegrees: 'Dr.',
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
    tenantRepository = new MemoryTenantRepository();
    teacherRepository = new MemoryTeacherRepository();
    userRepository = new MemoryUserRepository();

    emailAuthValidator = new EmailAuthValidatorService(authUserRepository);
    tenantService = new TenantService(tenantRepository);
    tokenService = new TokenService('PxHf3H7');
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

    createUserTeacher = new CreateUserTeacher(
      teacherRepository,
      emailAuthValidator,
      policiesService,
      userService
    );
    deleteUserTeacher = new DeleteUserTeacher(teacherRepository, policiesService);
    findAllUserTeacher = new FindAllUserTeacher(
      teacherRepository,
      policiesService,
      userService
    );
    findUserTeacher = new FindUserTeacher(
      teacherRepository,
      policiesService,
      userService
    );
    updateUserTeacher = new UpdateUserTeacher(
      teacherRepository,
      policiesService,
      userService
    );

    facadeTeacher = new TeacherFacade({
      createUserTeacher,
      deleteUserTeacher,
      findAllUserTeacher,
      findUserTeacher,
      updateUserTeacher,
    });
  });

  it('should create a Teacher user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeTeacher.create(input, token);

    expect(result.id).toBeDefined();
  });

  it('should find a Teacher user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeTeacher.create(input, token);
    const userTeacher = await facadeTeacher.find(result, token);

    expect(userTeacher).toBeDefined();
  });

  it('should find all Teacher users using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeTeacher.create(input, token);
    await facadeTeacher.create(input2, token);
    await facadeTeacher.create(input3, token);
    const allUsers = await facadeTeacher.findAll({}, token);

    expect(allUsers.length).toBe(3);
  });

  it('should delete a Teacher user using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeTeacher.create(input, token);
    const id2 = await facadeTeacher.create(input2, token);
    await facadeTeacher.create(input3, token);
    const result = await facadeTeacher.delete({ id: id2.id }, token);
    //const allUsers = await facadeTeacher.findAll({}, token);

    expect(result.message).toBe('Operation completed successfully');
    //expect(allUsers.length).toBe(2);
  });

  it('should update a Teacher user using the facade', async () => {
    await createAuthUserFor(input.email);
    const id = await facadeTeacher.create(input, token);

    const result = await facadeTeacher.update(
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
