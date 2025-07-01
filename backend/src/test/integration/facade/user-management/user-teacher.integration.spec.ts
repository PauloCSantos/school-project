import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsers } from '@/modules/@shared/type/enum';

import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryTeacherRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/teacher.repository';

import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
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
import TokenService from '@/modules/@shared/infraestructure/service/token.service';

describe('User Teacher facade integration test', () => {
  let authUserRepository: MemoryAuthUserRepository;
  let teacherRepository: MemoryTeacherRepository;
  let emailAuthValidator: EmailAuthValidatorService;
  let authUserService: AuthUserService;
  let tokenService: TokenService;
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
    authUserRepository = new MemoryAuthUserRepository();
    teacherRepository = new MemoryTeacherRepository();
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

    createUserTeacher = new CreateUserTeacher(
      teacherRepository,
      emailAuthValidator
    );
    deleteUserTeacher = new DeleteUserTeacher(teacherRepository);
    findAllUserTeacher = new FindAllUserTeacher(teacherRepository);
    findUserTeacher = new FindUserTeacher(teacherRepository);
    updateUserTeacher = new UpdateUserTeacher(teacherRepository);

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
    const result = await facadeTeacher.create(input);

    expect(result.id).toBeDefined();
  });

  it('should find a Teacher user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeTeacher.create(input);
    const userTeacher = await facadeTeacher.find(result);

    expect(userTeacher).toBeDefined();
  });

  it('should find all Teacher users using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeTeacher.create(input);
    await facadeTeacher.create(input2);
    await facadeTeacher.create(input3);
    const allUsers = await facadeTeacher.findAll({});

    expect(allUsers.length).toBe(3);
  });

  it('should delete a Teacher user using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeTeacher.create(input);
    const id2 = await facadeTeacher.create(input2);
    await facadeTeacher.create(input3);
    const result = await facadeTeacher.delete({ id: id2.id });
    const allUsers = await facadeTeacher.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });

  it('should update a Teacher user using the facade', async () => {
    await createAuthUserFor(input.email);
    const id = await facadeTeacher.create(input);

    const result = await facadeTeacher.update({
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
