import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsers } from '@/modules/@shared/type/enum';

import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryStudentRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/student.repository';

import AuthUserService from '@/modules/authentication-authorization-management/application/service/user-entity.service';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import AuthUserFacade from '@/modules/authentication-authorization-management/application/facade/facade/user.facade';

import CreateUserStudent from '@/modules/user-management/application/usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '@/modules/user-management/application/usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/modules/user-management/application/usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '@/modules/user-management/application/usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '@/modules/user-management/application/usecases/student/updateUserStudent.usecase';
import StudentFacade from '@/modules/user-management/application/facade/facade/student.facade';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import TokenService from '@/modules/@shared/infraestructure/service/token.service';

describe('User Student facade integration test', () => {
  let authUserRepository: MemoryAuthUserRepository;
  let studentRepository: MemoryStudentRepository;
  let emailAuthValidator: EmailAuthValidatorService;
  let authUserService: AuthUserService;
  let tokenService: TokenService;
  let createAuthUser: CreateAuthUser;
  let deleteAuthUser: DeleteAuthUser;
  let findAuthUser: FindAuthUser;
  let updateAuthUser: UpdateAuthUser;
  let loginAuthUser: LoginAuthUser;
  let facadeAuthUser: AuthUserFacade;

  let createUserStudent: CreateUserStudent;
  let deleteUserStudent: DeleteUserStudent;
  let findAllUserStudent: FindAllUserStudent;
  let findUserStudent: FindUserStudent;
  let updateUserStudent: UpdateUserStudent;
  let facadeStudent: StudentFacade;

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
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    paymentYear: 20000,
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
    birthday: new Date('11-12-1995'),
    email: 'teste2@test.com',
    paymentYear: 28000,
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
    birthday: new Date('11-12-1995'),
    email: 'teste3@test.com',
    paymentYear: 32000,
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
    // Create fresh shared instances for each test
    authUserRepository = new MemoryAuthUserRepository();
    studentRepository = new MemoryStudentRepository();
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

    createUserStudent = new CreateUserStudent(
      studentRepository,
      emailAuthValidator
    );
    deleteUserStudent = new DeleteUserStudent(studentRepository);
    findAllUserStudent = new FindAllUserStudent(studentRepository);
    findUserStudent = new FindUserStudent(studentRepository);
    updateUserStudent = new UpdateUserStudent(studentRepository);

    facadeStudent = new StudentFacade({
      createUserStudent,
      deleteUserStudent,
      findAllUserStudent,
      findUserStudent,
      updateUserStudent,
    });
  });

  it('should create a Student user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeStudent.create(input);
    expect(result.id).toBeDefined();
  });

  it('should find a Student user using the facade', async () => {
    await createAuthUserFor(input.email);
    const result = await facadeStudent.create(input);
    const userStudent = await facadeStudent.find(result);
    expect(userStudent).toBeDefined();
  });

  it('should find all Student users using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeStudent.create(input);
    await facadeStudent.create(input2);
    await facadeStudent.create(input3);

    const allUsers = await facadeStudent.findAll({});
    expect(allUsers.length).toBe(3);
  });

  it('should delete a Student user using the facade', async () => {
    await createAuthUserFor(input.email);
    await createAuthUserFor(input2.email);
    await createAuthUserFor(input3.email);

    await facadeStudent.create(input);
    const id2 = await facadeStudent.create(input2);
    await facadeStudent.create(input3);
    const result = await facadeStudent.delete({ id: id2.id });
    const allUsers = await facadeStudent.findAll({});
    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });

  it('should update a Student user using the facade', async () => {
    await createAuthUserFor(input.email);
    const id = await facadeStudent.create(input);
    const result = await facadeStudent.update({
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
