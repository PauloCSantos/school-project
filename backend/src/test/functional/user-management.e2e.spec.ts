import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserAdministrator from '@/modules/user-management/application/usecases/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/modules/user-management/application/usecases/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/modules/user-management/application/usecases/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/modules/user-management/application/usecases/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/modules/user-management/application/usecases/administrator/updateUserAdministrator.usecase';
import CreateUserMaster from '@/modules/user-management/application/usecases/master/createUserMaster.usecase';
import FindUserMaster from '@/modules/user-management/application/usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '@/modules/user-management/application/usecases/master/updateUserMaster.usecase';
import CreateUserStudent from '@/modules/user-management/application/usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '@/modules/user-management/application/usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/modules/user-management/application/usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '@/modules/user-management/application/usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '@/modules/user-management/application/usecases/student/updateUserStudent.usecase';
import CreateUserTeacher from '@/modules/user-management/application/usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '@/modules/user-management/application/usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '@/modules/user-management/application/usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '@/modules/user-management/application/usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '@/modules/user-management/application/usecases/teacher/updateUserTeacher.usecase';
import CreateUserWorker from '@/modules/user-management/application/usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '@/modules/user-management/application/usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '@/modules/user-management/application/usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '@/modules/user-management/application/usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '@/modules/user-management/application/usecases/worker/updateUserWorker.usecase';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import MemoryUserAdministratorRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/administrator.repository';
import MemoryUserMasterRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/master.repository';
import MemoryUserStudentRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/student.repository';
import MemoryUserTeacherRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/teacher.repository';
import MemoryUserWorkerRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/worker.repository';
import { UserAdministratorController } from '@/modules/user-management/interface/controller/administrator.controller';
import { UserMasterController } from '@/modules/user-management/interface/controller/master.controller';
import { UserStudentController } from '@/modules/user-management/interface/controller/student.controller';
import { UserTeacherController } from '@/modules/user-management/interface/controller/teacher.controller';
import { UserWorkerController } from '@/modules/user-management/interface/controller/worker.controller';
import { UserAdministratorRoute } from '@/modules/user-management/interface/route/administrator.route';
import { UserMasterRoute } from '@/modules/user-management/interface/route/master.route';
import { UserStudentRoute } from '@/modules/user-management/interface/route/student.route';
import { UserTeacherRoute } from '@/modules/user-management/interface/route/teacher.route';
import { UserWorkerRoute } from '@/modules/user-management/interface/route/worker.route';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import MemoryUserRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/user.repository';
import { UserService } from '@/modules/user-management/domain/services/user.service';

let tokenService: TokenService;

async function makeToken(): Promise<string> {
  const authService = new AuthUserService();
  const authUser = new AuthUser(
    {
      email: 'usermanagement@example.com',
      password: 'StrongPass1!',
      isHashed: false,
    },
    authService
  );
  const masterId = new Id().value;
  return tokenService.generateToken(
    authUser as any,
    masterId,
    RoleUsersEnum.MASTER,
    '30m'
  );
}

async function authHeader() {
  const token = await makeToken();
  return { authorization: token };
}

async function createAuthUserInMemory(email: string, repository: any) {
  await repository.create(
    new AuthUser(
      {
        email,
        password: 'testPassword123',
        isHashed: true,
      },
      new AuthUserService()
    )
  );
}

describe('User management module end to end test', () => {
  let userAdministratorRepository = new MemoryUserAdministratorRepository();
  let userMasterRepository = new MemoryUserMasterRepository();
  let userStudentRepository = new MemoryUserStudentRepository();
  let userTeacherRepository = new MemoryUserTeacherRepository();
  let userWorkerRepository = new MemoryUserWorkerRepository();
  let userRepository = new MemoryUserRepository();
  let authUserService = new AuthUserService();
  let authUserRepository = new MemoryAuthUserRepository(authUserService);
  let emailValidatorService = new EmailAuthValidatorService(authUserRepository);
  let userService = new UserService(userRepository);
  let app: any;
  beforeEach(() => {
    userAdministratorRepository = new MemoryUserAdministratorRepository();
    userMasterRepository = new MemoryUserMasterRepository();
    userStudentRepository = new MemoryUserStudentRepository();
    userTeacherRepository = new MemoryUserTeacherRepository();
    userWorkerRepository = new MemoryUserWorkerRepository();
    userRepository = new MemoryUserRepository();
    authUserRepository = new MemoryAuthUserRepository(authUserService);
    emailValidatorService = new EmailAuthValidatorService(authUserRepository);
    userService = new UserService(userRepository);

    const policiesService = new PoliciesService();
    const createUserAdministratorUsecase = new CreateUserAdministrator(
      userAdministratorRepository,
      emailValidatorService,
      policiesService,
      userService
    );
    const findUserAdministratorUsecase = new FindUserAdministrator(
      userAdministratorRepository,
      policiesService,
      userService
    );
    const findAllUserAdministratorUsecase = new FindAllUserAdministrator(
      userAdministratorRepository,
      policiesService,
      userService
    );
    const updateUserAdministratorUsecase = new UpdateUserAdministrator(
      userAdministratorRepository,
      policiesService,
      userService
    );
    const deleteUserAdministratorUsecase = new DeleteUserAdministrator(
      userAdministratorRepository,
      policiesService
    );
    const createUserMasterUsecase = new CreateUserMaster(
      userMasterRepository,
      emailValidatorService,
      policiesService,
      userService
    );
    const findUserMasterUsecase = new FindUserMaster(
      userMasterRepository,
      policiesService,
      userService
    );
    const updateUserMasterUsecase = new UpdateUserMaster(
      userMasterRepository,
      policiesService,
      userService
    );

    const createUserStudentUsecase = new CreateUserStudent(
      userStudentRepository,
      emailValidatorService,
      policiesService,
      userService
    );
    const findUserStudentUsecase = new FindUserStudent(
      userStudentRepository,
      policiesService,
      userService
    );
    const findAllUserStudentUsecase = new FindAllUserStudent(
      userStudentRepository,
      policiesService,
      userService
    );
    const updateUserStudentUsecase = new UpdateUserStudent(
      userStudentRepository,
      policiesService,
      userService
    );
    const deleteUserStudentUsecase = new DeleteUserStudent(
      userStudentRepository,
      policiesService
    );

    const createUserTeacherUsecase = new CreateUserTeacher(
      userTeacherRepository,
      emailValidatorService,
      policiesService,
      userService
    );
    const findUserTeacherUsecase = new FindUserTeacher(
      userTeacherRepository,
      policiesService,
      userService
    );
    const findAllUserTeacherUsecase = new FindAllUserTeacher(
      userTeacherRepository,
      policiesService,
      userService
    );
    const updateUserTeacherUsecase = new UpdateUserTeacher(
      userTeacherRepository,
      policiesService,
      userService
    );
    const deleteUserTeacherUsecase = new DeleteUserTeacher(
      userTeacherRepository,
      policiesService
    );

    const createUserWorkerUsecase = new CreateUserWorker(
      userWorkerRepository,
      emailValidatorService,
      policiesService,
      userService
    );
    const findUserWorkerUsecase = new FindUserWorker(
      userWorkerRepository,
      policiesService,
      userService
    );
    const findAllUserWorkerUsecase = new FindAllUserWorker(
      userWorkerRepository,
      policiesService,
      userService
    );
    const updateUserWorkerUsecase = new UpdateUserWorker(
      userWorkerRepository,
      policiesService,
      userService
    );
    const deleteUserWorkerUsecase = new DeleteUserWorker(
      userWorkerRepository,
      policiesService
    );

    const userAdministratorController = new UserAdministratorController(
      createUserAdministratorUsecase,
      findUserAdministratorUsecase,
      findAllUserAdministratorUsecase,
      updateUserAdministratorUsecase,
      deleteUserAdministratorUsecase
    );
    const userMasterController = new UserMasterController(
      createUserMasterUsecase,
      findUserMasterUsecase,
      updateUserMasterUsecase
    );
    const userStudentController = new UserStudentController(
      createUserStudentUsecase,
      findUserStudentUsecase,
      findAllUserStudentUsecase,
      updateUserStudentUsecase,
      deleteUserStudentUsecase
    );
    const userTeacherController = new UserTeacherController(
      createUserTeacherUsecase,
      findUserTeacherUsecase,
      findAllUserTeacherUsecase,
      updateUserTeacherUsecase,
      deleteUserTeacherUsecase
    );
    const userWorkerController = new UserWorkerController(
      createUserWorkerUsecase,
      findUserWorkerUsecase,
      findAllUserWorkerUsecase,
      updateUserWorkerUsecase,
      deleteUserWorkerUsecase
    );
    const expressHttp = new ExpressAdapter();
    tokenService = new TokenService('e2e-secret');

    const authUserMiddlewareMaster = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
    ]);
    const authUserMiddlewareAdministrator = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
    ]);
    const authUserMiddlewareTeacher = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.TEACHER,
    ]);
    const authUserMiddlewareStudent = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
    ]);
    const authUserMiddlewareWorker = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.WORKER,
    ]);

    const userAdministratorRoute = new UserAdministratorRoute(
      userAdministratorController,
      expressHttp,
      authUserMiddlewareAdministrator
    );
    const userMasterRoute = new UserMasterRoute(
      userMasterController,
      expressHttp,
      authUserMiddlewareMaster
    );
    const userStudentRoute = new UserStudentRoute(
      userStudentController,
      expressHttp,
      authUserMiddlewareStudent
    );
    const userTeacherRoute = new UserTeacherRoute(
      userTeacherController,
      expressHttp,
      authUserMiddlewareTeacher
    );
    const userWorkerRoute = new UserWorkerRoute(
      userWorkerController,
      expressHttp,
      authUserMiddlewareWorker
    );

    userAdministratorRoute.routes();
    userMasterRoute.routes();
    userStudentRoute.routes();
    userTeacherRoute.routes();
    userWorkerRoute.routes();
    app = expressHttp.getNativeServer();
  });

  describe('User administrator', () => {
    describe('On error', () => {
      describe('POST /user-administrator', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-administrator')
            .set(await authHeader())
            .send({
              name: {
                firstName: '',
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              graduation: 'Math',
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('GET /user-administrator/:id', () => {
        it('should return 401 when authorization header is missing on /users-administrator', async () => {
          const response = await supertest(app).get('/users-administrator');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid on /users-administrator', async () => {
          const response = await supertest(app)
            .get('/users-administrator')
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when GET /user-administrator/:id does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/user-administrator/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return empty string when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-administrator')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              graduation: 'Math',
            });

          const response = await supertest(app)
            .get(`/user-administrator/123`)
            .set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('PATCH /user-administrator', () => {
        it('should return 400 when PATCH /user-administrator is missing id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-administrator')
            .set(headers)
            .send({
              name: { firstName: 'No', lastName: 'Id' },
            });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-administrator has malformed id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-administrator')
            .set(headers)
            .send({
              id: '123',
              name: { firstName: 'Bad', lastName: 'Id' },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-administrator has invalid payload', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory(
            'valid_administrator@example.com',
            authUserRepository
          );
          const created = await supertest(app)
            .post('/user-administrator')
            .set(headers)
            .send({
              email: 'valid_administrator@example.com',
              password: 'StrongPass1!',
              name: { firstName: 'Valid', lastName: 'administrator' },
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
              birthday: '11-12-1995',
              graduation: 'Math',
            });

          const response = await supertest(app)
            .patch('/user-administrator')
            .set(headers)
            .send({
              id: created.body.id,
              name: { firstName: 123 },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when PATCH /user-administrator updates a non-existent user', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-administrator')
            .set(headers)
            .send({
              id: new Id().value,
              name: { firstName: 'John', lastName: 'Doe' },
            });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should throw an error when the data to update a user is wrong', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-administrator')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              graduation: 'Math',
            });
          const id = created.body.id;

          const response = await supertest(app)
            .patch(`/user-administrator`)
            .set(headers)
            .send({
              id,
              address: {
                zip: '',
                state: '',
              },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('DELETE /user-administrator/:id', () => {
        it('should return 404 when DELETE /user-administrator/:id does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .delete(`/user-administrator/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should throw an error when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-administrator')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              graduation: 'Math',
            });

          const response = await supertest(app)
            .delete(`/user-administrator/123`)
            .set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });
    describe('On success', () => {
      describe('POST /user-administrator', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-administrator')
            .set(await authHeader())
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              graduation: 'Math',
            });

          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /user-administrator/:id', () => {
        it('should find a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-administrator')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste2@test.com',
              graduation: 'Math',
            });
          const id = created.body.id;

          const response = await supertest(app)
            .get(`/user-administrator/${id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
      describe('GET /users-administrator', () => {
        it('should return empty array on GET /users-administrator when there are no administrators', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/users-administrator').set(headers);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(0);
        });

        it('should find all users', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          await supertest(app)
            .post('/user-administrator')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              graduation: 'Math',
            });
          await supertest(app)
            .post('/user-administrator')
            .set(headers)
            .send({
              name: {
                firstName: 'Marie',
                lastName: 'Doe',
              },
              address: {
                street: 'Street B',
                city: 'City B',
                zip: '111111-111',
                number: 2,
                avenue: 'Avenue B',
                state: 'State B',
              },
              salary: {
                salary: 5000,
              },
              birthday: '11-12-1995',
              email: 'teste2@test.com',
              graduation: 'Spanish',
            });

          const response = await supertest(app).get('/users-administrator').set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-administrator', () => {
        it('should update a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-administrator')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              graduation: 'Math',
            });
          const id = created.body.id;

          const response = await supertest(app)
            .patch(`/user-administrator`)
            .set(headers)
            .send({
              id,
              address: {
                street: 'Street B',
                city: 'City B',
                zip: '111111-111',
                number: 1,
                avenue: 'Avenue B',
                state: 'State B',
              },
            });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
      describe('DELETE /user-administrator/:id', () => {
        it('should delete a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-administrator')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              graduation: 'Math',
            });
          const id = created.body.id;

          const response = await supertest(app)
            .delete(`/user-administrator/${id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
  describe('User master', () => {
    describe('On error', () => {
      describe('POST /user-master', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-master')
            .set(await authHeader())
            .send({
              name: {
                firstName: 'John',
                lastName: 'Doe',
              },
              address: {
                street: '',
                city: 'City A',
                zip: '111111-111',
                number: 1,
                avenue: 'Avenue A',
                state: 'State A',
              },
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              cnpj: '35.741.901/0001-58',
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('GET /user-master/:id', () => {
        it('should return 401 when authorization header is missing on GET /user-master/:id', async () => {
          const response = await supertest(app).get(`/user-master/${new Id().value}`);

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid on GET /user-master/:id', async () => {
          const response = await supertest(app)
            .get(`/user-master/${new Id().value}`)
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body).toBeDefined();
        });

        it('should return 404 when GET /user-master/:id does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/user-master/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return empty string when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-master')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              cnpj: '35.741.901/0001-58',
            });

          const response = await supertest(app).get(`/user-master/123`).set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('PATCH /user-master', () => {
        it('should return 400 when PATCH /user-master is missing id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-master')
            .set(headers)
            .send({
              name: { firstName: 'No', lastName: 'Id' },
            });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-master has malformed id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-master')
            .set(headers)
            .send({
              id: '123',
              name: { firstName: 'Bad', lastName: 'Id' },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when PATCH /user-master updates a non-existent user', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-master')
            .set(headers)
            .send({
              id: new Id().value,
              name: { firstName: 'Ghost', lastName: 'User' },
            });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-master has invalid payload', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('valid_master@example.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-master')
            .set(headers)
            .send({
              email: 'valid_master@example.com',
              password: 'StrongPass1!',
              name: { firstName: 'Valid', lastName: 'Master' },
              address: {
                street: 'Street A',
                city: 'City A',
                zip: '111111-111',
                number: 1,
                avenue: 'Avenue A',
                state: 'State A',
              },
              birthday: '11-12-1995',
              cnpj: '35.741.901/0001-58',
            });
          const response = await supertest(app)
            .patch('/user-master')
            .set(headers)
            .send({
              id: created.body.id,
              name: { firstName: 123 },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should throw an error when the data to update a user is wrong', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-master')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              cnpj: '35.741.901/0001-58',
            });
          const id = created.body.id;

          const response = await supertest(app).patch(`/user-master`).set(headers).send({
            id,
            cnpj: '142154654',
          });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });
    describe('On success', () => {
      describe('POST /user-master', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-master')
            .set(await authHeader())
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              cnpj: '35.741.901/0001-58',
            });

          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /user-master/:id', () => {
        it('should find a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-master')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste1@test.com',
              cnpj: '35.741.901/0001-58',
            });
          const id = created.body.id;

          const response = await supertest(app).get(`/user-master/${id}`).set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
      describe('PATCH /user-master', () => {
        it('should update a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-master')
            .set(headers)
            .send({
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
              birthday: '11-12-1995',
              email: 'teste2@test.com',
              cnpj: '35.741.901/0001-58',
            });
          const id = created.body.id;

          const response = await supertest(app).patch(`/user-master`).set(headers).send({
            id,
            cnpj: '35.845.901/0001-58',
            email: 'teste123@test.com',
          });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
    });
  });
  describe('User student', () => {
    describe('On error', () => {
      describe('POST /user-student', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-student')
            .set(await authHeader())
            .send({
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
              paymentYear: '0',
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('GET /user-student/:id', () => {
        it('should return 401 when authorization header is missing on /users-student', async () => {
          const response = await supertest(app).get('/users-student');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid on /users-student', async () => {
          const response = await supertest(app)
            .get('/users-student')
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return empty string when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-student')
            .set(headers)
            .send({
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
            });

          const response = await supertest(app).get(`/user-student/123`).set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('PATCH /user-student', () => {
        it('should return 404 when GET /user-student/:id does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/user-student/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when DELETE /user-student/:id does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .delete(`/user-student/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when PATCH /user-student updates a non-existent user', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-student')
            .set(headers)
            .send({
              id: new Id().value,
              name: { firstName: 'John', lastName: 'Doe' },
            });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 400 when PATCH /user-student is missing id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-student')
            .set(headers)
            .send({
              name: { firstName: 'No', lastName: 'Id' },
            });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-student has malformed id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-student')
            .set(headers)
            .send({
              id: '123',
              name: { firstName: 'Bad', lastName: 'Id' },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-student has invalid payload', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('valid_student@example.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-student')
            .set(headers)
            .send({
              email: 'valid_student@example.com',
              password: 'StrongPass1!',
              name: { firstName: 'Valid', lastName: 'student' },
              address: {
                street: 'Street A',
                city: 'City A',
                zip: '111111-111',
                number: 1,
                avenue: 'Avenue A',
                state: 'State A',
              },
              birthday: new Date('11-12-1995'),
              paymentYear: 20000,
            });

          const response = await supertest(app)
            .patch('/user-student')
            .set(headers)
            .send({
              id: created.body.id,
              name: { lastName: 123 },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should throw an error when the data to update a user is wrong', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-student')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app).patch(`/user-student`).set(headers).send({
            id,
            paymentYear: 0,
          });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('DELETE /user-student/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-student')
            .set(headers)
            .send({
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
            });

          const response = await supertest(app).delete(`/user-student/123`).set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });
    describe('On success', () => {
      describe('POST /user-student', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-student')
            .set(await authHeader())
            .send({
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
            });

          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /user-student/:id', () => {
        it('should find a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-student')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app).get(`/user-student/${id}`).set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
      describe('GET /users-student', () => {
        it('should return empty array on GET /users-student when there are no students', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/users-student').set(headers);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(0);
        });
        it('should find all users', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          await supertest(app)
            .post('/user-student')
            .set(headers)
            .send({
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
            });
          await supertest(app)
            .post('/user-student')
            .set(headers)
            .send({
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
              email: 'teste2@test.com',
              paymentYear: 20000,
            });

          const response = await supertest(app).get('/users-student').set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-student', () => {
        it('should update a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-student')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app)
            .patch(`/user-student`)
            .set(headers)
            .send({
              id,
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
              email: 'teste1@test.com',
              paymentYear: 20000,
            });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
      describe('DELETE /user-student/:id', () => {
        it('should delete a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-student')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app)
            .delete(`/user-student/${id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
  describe('User teacher', () => {
    describe('On error', () => {
      describe('POST /user-teacher', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-teacher')
            .set(await authHeader())
            .send({
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
              graduation: 'Mh',
              academicDegrees: 'Mc',
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('GET /user-teacher/:id', () => {
        it('should return 401 when authorization header is missing on /users-teacher', async () => {
          const response = await supertest(app).get('/users-teacher');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid on /users-teacher', async () => {
          const response = await supertest(app)
            .get('/users-teacher')
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when GET /user-teacher/:id does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/user-teacher/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return empty string when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-teacher')
            .set(headers)
            .send({
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
            });

          const response = await supertest(app).get(`/user-teacher/123`).set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('PATCH /user-teacher', () => {
        it('should return 404 when DELETE /user-teacher/:id does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .delete(`/user-teacher/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when PATCH /user-teacher updates a non-existent user', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-teacher')
            .set(headers)
            .send({
              id: new Id().value,
              name: { firstName: 'John', lastName: 'Doe' },
            });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 400 when PATCH /user-teacher is missing id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-teacher')
            .set(headers)
            .send({
              name: { firstName: 'No', lastName: 'Id' },
            });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-teacher has malformed id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-teacher')
            .set(headers)
            .send({
              id: '123',
              name: { firstName: 'Bad', lastName: 'Id' },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-teacher has invalid payload', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('valid_teacher@example.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-teacher')
            .set(headers)
            .send({
              email: 'valid_teacher@example.com',
              password: 'StrongPass1!',
              name: { firstName: 'Valid', lastName: 'teacher' },
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
              graduation: 'Math',
              academicDegrees: 'Msc',
            });

          const response = await supertest(app)
            .patch('/user-teacher')
            .set(headers)
            .send({
              id: created.body.id,
              name: { firstName: 123 },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should throw an error when the data to update a user is wrong', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-teacher')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app).patch(`/user-teacher`).set(headers).send({
            id,
            academicDegrees: 0,
            birthday: '02/20/2024',
          });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('DELETE /user-teacher/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-teacher')
            .set(headers)
            .send({
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
            });
          const response = await supertest(app).delete(`/user-teacher/123`).set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });
    describe('On success', () => {
      describe('POST /user-teacher', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-teacher')
            .set(await authHeader())
            .send({
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
            });

          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /user-teacher/:id', () => {
        it('should find a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-teacher')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app).get(`/user-teacher/${id}`).set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
      describe('GET /users-teacher', () => {
        it('should return empty array on GET /users-teacher when there are no teachers', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/users-teacher').set(headers);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(0);
        });

        it('should find all users', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          await supertest(app)
            .post('/user-teacher')
            .set(headers)
            .send({
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
            });
          await supertest(app)
            .post('/user-teacher')
            .set(headers)
            .send({
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
              email: 'teste2@test.com',
              graduation: 'Math',
              academicDegrees: 'Msc',
            });

          const response = await supertest(app).get('/users-teacher').set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-teacher', () => {
        it('should update a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-teacher')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app)
            .patch(`/user-teacher`)
            .set(headers)
            .send({
              id,
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
            });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
      describe('DELETE /user-teacher/:id', () => {
        it('should delete a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-teacher')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app)
            .delete(`/user-teacher/${id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
  describe('User worker', () => {
    describe('On error', () => {
      describe('POST /user-worker', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-worker')
            .set(await authHeader())
            .send({
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
                salary: -5000,
              },
              birthday: new Date('11-12-1995'),
              email: 'teste1@test.com',
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('GET /user-worker/:id', () => {
        it('should return 401 when authorization header is missing on /users-worker', async () => {
          const response = await supertest(app).get('/users-worker');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid on /users-worker', async () => {
          const response = await supertest(app)
            .get('/users-worker')
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return empty string when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-worker')
            .set(headers)
            .send({
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
            });

          const response = await supertest(app).get(`/user-worker/123`).set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('PATCH /user-worker', () => {
        it('should return 404 when GET /user-worker/:id does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/user-worker/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when DELETE /user-worker/:id does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .delete(`/user-worker/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when PATCH /user-worker updates a non-existent user', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-worker')
            .set(headers)
            .send({
              id: new Id().value,
              name: { firstName: 'John', lastName: 'Doe' },
            });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 400 when PATCH /user-worker is missing id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-worker')
            .set(headers)
            .send({
              name: { firstName: 'No', lastName: 'Id' },
            });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-worker has malformed id', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .patch('/user-worker')
            .set(headers)
            .send({
              id: '123',
              name: { firstName: 'Bad', lastName: 'Id' },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when PATCH /user-worker has invalid payload', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('valid_worker@example.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-worker')
            .set(headers)
            .send({
              email: 'valid_worker@example.com',
              password: 'StrongPass1!',
              name: { firstName: 'Valid', lastName: 'worker' },
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
            });

          const response = await supertest(app)
            .patch('/user-worker')
            .set(headers)
            .send({
              id: created.body.id,
              name: { firstName: 123 },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should throw an error when the data to update a user is wrong', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-worker')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app)
            .patch(`/user-worker`)
            .set(headers)
            .send({
              id,
              salary: { salary: 'a' },
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
      describe('DELETE /user-worker/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-worker')
            .set(headers)
            .send({
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
            });

          const response = await supertest(app).delete(`/user-worker/123`).set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });
    describe('On success', () => {
      describe('POST /user-worker', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-worker')
            .set(await authHeader())
            .send({
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
            });

          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /user-worker/:id', () => {
        it('should find a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-worker')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app).get(`/user-worker/${id}`).set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
      describe('GET /users-worker/', () => {
        it('should return empty array on GET /users-worker when there are no workers', async () => {
          const headers = await authHeader();
          const result = await supertest(app).get('/users-worker').set(headers);

          expect(result.status).toBe(200);
          expect(Array.isArray(result.body)).toBe(true);
          expect(result.body.length).toBe(0);
        });

        it('should find all users', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          await supertest(app)
            .post('/user-worker')
            .set(headers)
            .send({
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
            });
          await supertest(app)
            .post('/user-worker')
            .set(headers)
            .send({
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
              email: 'teste2@test.com',
            });

          const response = await supertest(app).get('/users-worker').set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-worker', () => {
        it('should update a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-worker')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app)
            .patch(`/user-worker`)
            .set(headers)
            .send({
              id,
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
            });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
      describe('DELETE /user-worker/:id', () => {
        it('should delete a user by ID', async () => {
          const headers = await authHeader();
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const created = await supertest(app)
            .post('/user-worker')
            .set(headers)
            .send({
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
            });
          const id = created.body.id;

          const response = await supertest(app).delete(`/user-worker/${id}`).set(headers);

          expect(response.status).toBe(200);
          expect(response.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
});
