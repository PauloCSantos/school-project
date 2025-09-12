import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import tokenInstance from '@/main/config/token-service.instance';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserController from '@/modules/authentication-authorization-management/interface/controller/user.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import AuthUserRoute from '@/modules/authentication-authorization-management/interface/route/user.route';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { RoleUsers, TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';

import { TenantService } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import MemoryTenantRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/tenant.repository';
import AddRole from '@/modules/authentication-authorization-management/application/usecases/authUser/add-role.usecase';
import CheckRegistration from '@/modules/authentication-authorization-management/application/usecases/authUser/check-registration.usecase';
import MasterFacadeFactory from '@/modules/user-management/application/factory/master-facade.factory';
import AdministratorFacadeFactory from '@/modules/user-management/application/factory/administrator-facade.factory';
import TeacherFacadeFactory from '@/modules/user-management/application/factory/teacher-facade.factory';
import StudentFacadeFactory from '@/modules/user-management/application/factory/student-facade.factory';
import WorkerFacadeFactory from '@/modules/user-management/application/factory/worker-facade.factory';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import { UserService } from '@/modules/user-management/domain/services/user.service';
import MemoryUserRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryUserMasterRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/master.repository';
import MemoryUserAdministratorRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/administrator.repository';
import MemoryUserTeacherRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/teacher.repository';
import MemoryUserStudentRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/student.repository';
import MemoryUserWorkerRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/worker.repository';

async function registerAndLoginUser(app: any, userDataOverride = {}) {
  const defaultUserData = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    role: 'master' as RoleUsers,
    cnpj: '12345678000111',
  };

  const userData = { ...defaultUserData, ...userDataOverride };

  const registerResponse = await supertest(app).post('/registerTenant').send(userData);

  const loginResponse = await supertest(app).post('/login').send({
    email: userData.email,
    password: userData.password,
    role: userData.role,
    masterId: registerResponse.body.masterId,
  });

  return {
    token: loginResponse.body.token,
    email: registerResponse.body.email,
    masterId: registerResponse.body.masterId,
  };
}

async function registerNewUser(role: string, facade: any, masterId: any, email: string) {
  const newUser: any = {
    name: { firstName: 'John', middleName: 'Marcos', lastName: 'Doe' },
    address: {
      street: 'Street A',
      city: 'City A',
      zip: '12345',
      number: 1,
      avenue: 'Avenue A',
      state: 'SS',
    },
    email,
    birthday: new Date('11-12-1995'),
  };
  switch (role) {
    case 'master':
      newUser.cnpj = '12345678000113';
      break;
    case 'administrator':
      newUser.graduation = 'Administrator';
      newUser.salary = { salary: 5000, currency: 'R$' };
      break;
    case 'teacher':
      newUser.graduation = 'Biologic';
      newUser.academicDegrees = 'Msc';
      newUser.salary = { salary: 6000, currency: 'R$' };
      break;
    case 'student':
      newUser.paymentYear = 15000;
      break;
    case 'worker':
      newUser.salary = { salary: 1000, currency: 'R$' };
      break;
  }
  const tokenData: TokenData = {
    email,
    masterId: masterId,
    role: RoleUsersEnum.MASTER,
  };
  await facade.create(newUser, tokenData);
}

describe('Authentication authorization management module end to end test', () => {
  const tokenService = new TokenService('secretkey');

  let authUserService = new AuthUserService();
  let authUserRepository = new MemoryAuthUserRepository(authUserService);
  let tenantRepository = new MemoryTenantRepository();
  let tenantService = new TenantService(tenantRepository);
  let emailAuthValidatorService = new EmailAuthValidatorService(authUserRepository);
  let userRepository = new MemoryUserRepository();
  let userService = new UserService(userRepository);
  let policiesService = new PoliciesService();

  let masterRepository = new MemoryUserMasterRepository();
  let administratorRepository = new MemoryUserAdministratorRepository();
  let teacherRepository = new MemoryUserTeacherRepository();
  let studentRepository = new MemoryUserStudentRepository();
  let workerRepository = new MemoryUserWorkerRepository();

  let masterFacade = MasterFacadeFactory.create(
    masterRepository,
    emailAuthValidatorService,
    policiesService,
    userService
  );
  let administratorFacade = AdministratorFacadeFactory.create(
    administratorRepository,
    emailAuthValidatorService,
    policiesService,
    userService
  );
  let teacherFacade = TeacherFacadeFactory.create(
    teacherRepository,
    emailAuthValidatorService,
    policiesService,
    userService
  );
  let studentFacade = StudentFacadeFactory.create(
    studentRepository,
    emailAuthValidatorService,
    policiesService,
    userService
  );
  let workerFacade = WorkerFacadeFactory.create(
    workerRepository,
    emailAuthValidatorService,
    policiesService,
    userService
  );

  let app: any;

  beforeEach(() => {
    authUserRepository = new MemoryAuthUserRepository(authUserService);
    tenantRepository = new MemoryTenantRepository();
    tenantService = new TenantService(tenantRepository);
    policiesService = new PoliciesService();

    authUserService = new AuthUserService();
    emailAuthValidatorService = new EmailAuthValidatorService(authUserRepository);
    userRepository = new MemoryUserRepository();
    userService = new UserService(userRepository);

    masterRepository = new MemoryUserMasterRepository();
    administratorRepository = new MemoryUserAdministratorRepository();
    teacherRepository = new MemoryUserTeacherRepository();
    studentRepository = new MemoryUserStudentRepository();
    workerRepository = new MemoryUserWorkerRepository();

    masterFacade = MasterFacadeFactory.create(
      masterRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );
    administratorFacade = AdministratorFacadeFactory.create(
      administratorRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );
    teacherFacade = TeacherFacadeFactory.create(
      teacherRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );
    studentFacade = StudentFacadeFactory.create(
      studentRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );
    workerFacade = WorkerFacadeFactory.create(
      workerRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );

    masterFacade = MasterFacadeFactory.create(
      masterRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );
    administratorFacade = AdministratorFacadeFactory.create(
      administratorRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );
    teacherFacade = TeacherFacadeFactory.create(
      teacherRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );
    studentFacade = StudentFacadeFactory.create(
      studentRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );
    workerFacade = WorkerFacadeFactory.create(
      workerRepository,
      emailAuthValidatorService,
      policiesService,
      userService
    );

    const createAuthUserUsecase = new CreateAuthUser(
      authUserRepository,
      tenantRepository,
      authUserService,
      tenantService,
      policiesService
    );
    const deleteAuthUserUsecase = new DeleteAuthUser(authUserRepository, policiesService);
    const loginAuthUserUsecase = new LoginAuthUser(
      authUserRepository,
      authUserService,
      tokenService,
      tenantService
    );
    const checkRegistration = new CheckRegistration(
      masterFacade,
      administratorFacade,
      teacherFacade,
      studentFacade,
      workerFacade
    );
    const addRoleUsecase = new AddRole(
      authUserRepository,
      tenantRepository,
      tenantService,
      policiesService
    );

    const authUserController = new AuthUserController(
      createAuthUserUsecase,
      new FindAuthUser(authUserRepository, policiesService),
      new UpdateAuthUser(
        authUserRepository,
        tenantRepository,
        authUserService,
        tenantService,
        policiesService
      ),
      deleteAuthUserUsecase,
      loginAuthUserUsecase,
      checkRegistration,
      addRoleUsecase
    );

    const expressHttp = new ExpressAdapter();
    const tokenServiceInstance = tokenInstance('secretkey');
    const authUserMiddlewareAuthUser = new AuthUserMiddleware(tokenServiceInstance, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
      RoleUsersEnum.WORKER,
    ]);
    const authUserRoute = new AuthUserRoute(
      authUserController,
      expressHttp,
      authUserMiddlewareAuthUser
    );
    authUserRoute.routes();
    app = expressHttp.getNativeServer();
  });

  describe('AuthUser', () => {
    describe('On error', () => {
      describe('POST /register', () => {
        it('should throw an error when the data to create an authUser is wrong', async () => {
          const { token } = await registerAndLoginUser(app);
          const response = await supertest(app)
            .post('/register')
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              cnpj: '12345678000113',
              role: 'unknow',
              isHashed: false,
            })
            .set('authorization', `Bearer ${token}`);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
          expect(response.body.details).toBeDefined();
        });

        it('should throw an error when the data token is missing', async () => {
          const response = await supertest(app).post('/register').send({
            email: 'teste@teste.com.br',
            password: 'XpA2Jjd4',
            cnpj: '12345678000113',
            role: 'unknow',
            isHashed: false,
          });

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('GET /authUser/:email', () => {
        it('should throw an error when the email to find an authUser is wrong', async () => {
          const { token } = await registerAndLoginUser(app);

          const response = await supertest(app)
            .get(`/authUser/123`)
            .set('authorization', `Bearer ${token}`);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
          expect(response.body.details).toBeDefined();
        });
      });

      describe('PATCH /authUser', () => {
        it('should throw an error when the data to update an authUser is wrong', async () => {
          const { token } = await registerAndLoginUser(app);

          const response = await supertest(app)
            .patch('/authUser')
            .send({
              email: 'teste@teste.com.br',
              authUserDataToUpdate: { password: '' },
            })
            .set('authorization', token);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('DELETE /authUser/:email', () => {
        it('should throw an error when the email to delete an authUser is wrong', async () => {
          const { token } = await registerAndLoginUser(app);

          const response = await supertest(app)
            .delete(`/authUser/123`)
            .set('authorization', token);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('POST /login', () => {
        it('should throw an error when the data to login is wrong', async () => {
          const { token } = await registerAndLoginUser(app);

          await supertest(app)
            .post('/register')
            .send({
              email: 'teste2@teste.com.br',
              password: 'XpA2Jjd4',
              cnpj: '12345678000111',
              role: 'master',
            })
            .set('authorization', token);

          const response = await supertest(app).post('/login').send({
            email: 'teste2@teste.com.br',
            password: 'wrongPassword',
            role: 'master',
          });

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('MIDDLEWARE /auth', () => {
        it('should return 401 when authorization header is missing', async () => {
          const response = await supertest(app).get('/authUser/not-exists@example.com');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid or malformed', async () => {
          const response = await supertest(app)
            .get('/authUser/not-exists@example.com')
            .set('authorization', 'invalid-token');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBe('Invalid token');
        });
      });

      describe('POST /register (more errors)', () => {
        it('should return 409 when email already exists with different password', async () => {
          await supertest(app).post('/registerTenant').send({
            email: 'duplicate@teste.com.br',
            password: 'FirstPass1',
            cnpj: '12345678000111',
            role: 'master',
          });

          const response = await supertest(app).post('/registerTenant').send({
            email: 'duplicate@teste.com.br',
            password: 'OtherPass2',
            cnpj: '12345678000111',
            role: 'master',
          });

          expect(response.status).toBe(409);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBe('E-mail in use');
        });

        it('should return 400 when neither cnpj is provided or user is authenticated', async () => {
          const response = await supertest(app)
            .post('/registerTenant')
            .send({
              email: 'no-cnpj@teste.com.br',
              password: 'XpA2Jjd4',
              role: 'master' as RoleUsers,
            });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBe('Missing required field');
        });
      });

      describe('GET /authUser/:email (not found)', () => {
        it('should return 404 when user does not exist', async () => {
          const { token } = await registerAndLoginUser(app);
          const response = await supertest(app)
            .get('/authUser/not-found@teste.com.br')
            .set('authorization', token);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('POST /login (more errors)', () => {
        it('should return 401 when email does not exist', async () => {
          const response = await supertest(app).post('/login').send({
            email: 'unknown@teste.com.br',
            password: 'SomePass1',
            role: 'master',
            masterId: new Id().value,
          });
          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });

    describe('On success', () => {
      describe('POST /registerTenant', () => {
        it('should create an authUser', async () => {
          const response = await supertest(app)
            .post('/registerTenant')
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              cnpj: '12345678000111',
              role: 'master' as RoleUsers,
            });

          expect(response.status).toBe(201);
          expect(response.body.email).toBeDefined();
          expect(response.body.masterId).toBeDefined();
        });
      });

      describe('POST /register', () => {
        it('should create an new user', async () => {
          const { token } = await registerAndLoginUser(app);
          const response = await supertest(app)
            .post('/register')
            .send({
              email: 'teste2@teste.com.br',
              password: 'XpA2Jjd5',
              role: 'administrator' as RoleUsers,
              cnpj: '12345678000111',
            })
            .set('authorization', `Bearer ${token}`);

          expect(response.status).toBe(201);
          expect(response.body.email).toBeDefined();
          expect(response.body.masterId).toBeDefined();
        });
      });

      describe('GET /authUser/:email', () => {
        it('should find a authUser', async () => {
          const { token, email } = await registerAndLoginUser(app);

          const response = await supertest(app)
            .get(`/authUser/${email}`)
            .set('authorization', `Bearer ${token}`);

          expect(response.status).toBe(200);
          expect(response.body.email).toBeDefined();
        });
      });

      describe('PATCH /authUser', () => {
        it('should update a authUser', async () => {
          const { token } = await registerAndLoginUser(app);

          const response = await supertest(app)
            .patch('/authUser')
            .send({
              email: 'teste@teste.com.br',
              authUserDataToUpdate: { password: 'XpA2Jjd4' },
            })
            .set('authorization', token);

          expect(response.status).toBe(200);
          expect(response.body.email).toBeDefined();
        });
      });

      describe('DELETE /authUser/:email', () => {
        it('should delete a authUser', async () => {
          const { token, email } = await registerAndLoginUser(app);

          const response = await supertest(app)
            .delete(`/authUser/${email}`)
            .set('authorization', token);

          expect(response.status).toBe(200);
          expect(response.body.message).toBe('Operation completed successfully');
        });
      });

      describe('POST /login', () => {
        it('should login and receive a token', async () => {
          const { token } = await registerAndLoginUser(app);

          expect(token).toBeDefined();
        });
      });

      describe('POST /checkRegistration', () => {
        it('should return true when exist the user', async () => {
          const { token, masterId, email } = await registerAndLoginUser(app);
          await registerNewUser('master', masterFacade, masterId, email);

          const response = await supertest(app)
            .post('/checkRegistration')
            .set('authorization', `Bearer ${token}`);

          expect(response.status).toBe(200);
          expect(response.body.registered).toBeTruthy();
        });
        it('should return false when the user does not exist', async () => {
          const { masterId, email, token } = await registerAndLoginUser(app);
          await supertest(app)
            .post('/register')
            .set('authorization', `Bearer ${token}`)
            .send({
              email,
              password: 'XpA2Jjd4',
              role: 'administrator',
            });
          await registerNewUser('administrator', administratorFacade, masterId, email);

          const response = await supertest(app)
            .post('/checkRegistration')
            .set('authorization', `Bearer ${token}`);

          expect(response.status).toBe(200);
          expect(response.body.registered).toBeFalsy();
        });
      });

      describe('POST /authUser/add', () => {
        it('should add role to tenant', async () => {
          const { token, email } = await registerAndLoginUser(app);

          const response = await supertest(app)
            .post('/authUser/add')
            .set('authorization', `Bearer ${token}`)
            .send({ email, role: 'administrator' });

          expect(response.status).toBe(204);
        });
      });
    });
  });
});
