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
import tokenInstance from '@/main/config/tokenService/token-service.instance';
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

async function createAuthUserInMemory(
  email: string,
  repository: any,
  role = 'master'
) {
  await repository.create({
    id: new Id().value,
    email,
    password: 'testPassword123',
    masterId: new Id().value,
    role,
    isHashed: false,
  });
}

describe('User management module end to end test', () => {
  let userAdministratorRepository = new MemoryUserAdministratorRepository();
  let userMasterRepository = new MemoryUserMasterRepository();
  let userStudentRepository = new MemoryUserStudentRepository();
  let userTeacherRepository = new MemoryUserTeacherRepository();
  let userWorkerRepository = new MemoryUserWorkerRepository();
  let authUserRepository = new MemoryAuthUserRepository();
  let emailValidatorService = new EmailAuthValidatorService(authUserRepository);
  let app: any;
  beforeEach(() => {
    userAdministratorRepository = new MemoryUserAdministratorRepository();
    userMasterRepository = new MemoryUserMasterRepository();
    userStudentRepository = new MemoryUserStudentRepository();
    userTeacherRepository = new MemoryUserTeacherRepository();
    userWorkerRepository = new MemoryUserWorkerRepository();
    authUserRepository = new MemoryAuthUserRepository();
    emailValidatorService = new EmailAuthValidatorService(authUserRepository);
    const createUserAdministratorUsecase = new CreateUserAdministrator(
      userAdministratorRepository,
      emailValidatorService
    );
    const findUserAdministratorUsecase = new FindUserAdministrator(
      userAdministratorRepository
    );
    const findAllUserAdministratorUsecase = new FindAllUserAdministrator(
      userAdministratorRepository
    );
    const updateUserAdministratorUsecase = new UpdateUserAdministrator(
      userAdministratorRepository
    );
    const deleteUserAdministratorUsecase = new DeleteUserAdministrator(
      userAdministratorRepository
    );
    const createUserMasterUsecase = new CreateUserMaster(
      userMasterRepository,
      emailValidatorService
    );
    const findUserMasterUsecase = new FindUserMaster(userMasterRepository);
    const updateUserMasterUsecase = new UpdateUserMaster(userMasterRepository);

    const createUserStudentUsecase = new CreateUserStudent(
      userStudentRepository,
      emailValidatorService
    );
    const findUserStudentUsecase = new FindUserStudent(userStudentRepository);
    const findAllUserStudentUsecase = new FindAllUserStudent(
      userStudentRepository
    );
    const updateUserStudentUsecase = new UpdateUserStudent(
      userStudentRepository
    );
    const deleteUserStudentUsecase = new DeleteUserStudent(
      userStudentRepository
    );

    const createUserTeacherUsecase = new CreateUserTeacher(
      userTeacherRepository,
      emailValidatorService
    );
    const findUserTeacherUsecase = new FindUserTeacher(userTeacherRepository);
    const findAllUserTeacherUsecase = new FindAllUserTeacher(
      userTeacherRepository
    );
    const updateUserTeacherUsecase = new UpdateUserTeacher(
      userTeacherRepository
    );
    const deleteUserTeacherUsecase = new DeleteUserTeacher(
      userTeacherRepository
    );

    const createUserWorkerUsecase = new CreateUserWorker(
      userWorkerRepository,
      emailValidatorService
    );
    const findUserWorkerUsecase = new FindUserWorker(userWorkerRepository);
    const findAllUserWorkerUsecase = new FindAllUserWorker(
      userWorkerRepository
    );
    const updateUserWorkerUsecase = new UpdateUserWorker(userWorkerRepository);
    const deleteUserWorkerUsecase = new DeleteUserWorker(userWorkerRepository);

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
    const tokerService = tokenInstance();

    const authUserMiddlewareMaster = new AuthUserMiddleware(tokerService, [
      'master',
    ]);
    const authUserMiddlewareAdministrator = new AuthUserMiddleware(
      tokerService,
      ['master', 'administrator']
    );
    const authUserMiddlewareTeacher = new AuthUserMiddleware(tokerService, [
      'master',
      'administrator',
      'teacher',
      'student',
    ]);
    const authUserMiddlewareStudent = new AuthUserMiddleware(tokerService, [
      'master',
      'administrator',
      'teacher',
      'student',
    ]);
    const authUserMiddlewareWorker = new AuthUserMiddleware(tokerService, [
      'master',
      'worker',
      'administrator',
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /user-administrator/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-administrator')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const userAdministrator = await supertest(app)
            .get(`/user-administrator/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(userAdministrator.status).toBe(400);
          expect(userAdministrator.body.error).toBeDefined();
        });
      });
      describe('PATCH /user-administrator', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-administrator')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-administrator`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id,
              address: {
                zip: '',
                state: '',
              },
            });
          expect(updatedUser.status).toBe(400);
          expect(updatedUser.body.error).toBeDefined();
        });
      });
      describe('DELETE /user-administrator/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-administrator')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const result = await supertest(app)
            .delete(`/user-administrator/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On success', () => {
      describe('POST /user-administrator', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-administrator')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-administrator')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const userAdministrator = await supertest(app)
            .get(`/user-administrator/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(userAdministrator.status).toBe(200);
          expect(userAdministrator.body).toBeDefined();
        });
      });
      describe('GET /users-administrator', () => {
        it('should find all users', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          await supertest(app)
            .post('/user-administrator')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const response = await supertest(app)
            .get('/users-administrator')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-administrator', () => {
        it('should update a user by ID', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-administrator')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-administrator`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          expect(updatedUser.status).toBe(200);
          expect(updatedUser.body).toBeDefined();
        });
      });
      describe('DELETE /user-administrator/:id', () => {
        it('should delete a user by ID', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-administrator')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const result = await supertest(app)
            .delete(`/user-administrator/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /user-master/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-master')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const response = await supertest(app)
            .get(`/user-master/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('PATCH /user-master', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-master')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-master`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id,
              cnpj: '142154654',
            });
          expect(updatedUser.status).toBe(400);
          expect(updatedUser.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /user-master', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-master')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-master')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const userMaster = await supertest(app)
            .get(`/user-master/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(userMaster.status).toBe(200);
          expect(userMaster.body).toBeDefined();
        });
      });
      describe('PATCH /user-master', () => {
        it('should update a user by ID', async () => {
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-master')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-master`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id,
              cnpj: '35.845.901/0001-58',
              email: 'teste123@test.com',
            });
          expect(updatedUser.status).toBe(200);
          expect(updatedUser.body).toBeDefined();
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /user-student/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-student')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const userStudent = await supertest(app)
            .get(`/user-student/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(userStudent.status).toBe(400);
          expect(userStudent.body.error).toBeDefined();
        });
      });
      describe('PATCH /user-student', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-student')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-student`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id,
              paymentYear: 0,
            });
          expect(updatedUser.status).toBe(400);
          expect(updatedUser.body.error).toBeDefined();
        });
      });
      describe('DELETE /user-student/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-student')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const result = await supertest(app)
            .delete(`/user-student/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /user-student', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-student')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-student')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const userStudent = await supertest(app)
            .get(`/user-student/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(userStudent.status).toBe(200);
          expect(userStudent.body).toBeDefined();
        });
      });
      describe('GET /users-student', () => {
        it('should find all users', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          await supertest(app)
            .post('/user-student')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const response = await supertest(app)
            .get('/users-student')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-student', () => {
        it('should update a user by ID', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-student')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-student`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          expect(updatedUser.status).toBe(200);
          expect(updatedUser.body).toBeDefined();
        });
      });
      describe('DELETE /user-student/:id', () => {
        it('should delete a user by ID', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-student')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const result = await supertest(app)
            .delete(`/user-student/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /user-teacher/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-teacher')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const userTeacher = await supertest(app)
            .get(`/user-teacher/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(userTeacher.status).toBe(400);
          expect(userTeacher.body.error).toBeDefined();
        });
      });
      describe('PATCH /user-teacher', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-teacher')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-teacher`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id,
              academicDegrees: 0,
              birthday: '02/20/2024',
            });
          expect(updatedUser.status).toBe(400);
          expect(updatedUser.body.error).toBeDefined();
        });
      });
      describe('DELETE /user-teacher/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-teacher')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const result = await supertest(app)
            .delete(`/user-teacher/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /user-teacher', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-teacher')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-teacher')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const userTeacher = await supertest(app)
            .get(`/user-teacher/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(userTeacher.status).toBe(200);
          expect(userTeacher.body).toBeDefined();
        });
      });
      describe('GET /users-teacher', () => {
        it('should find all users', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          await supertest(app)
            .post('/user-teacher')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const response = await supertest(app)
            .get('/users-teacher')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-teacher', () => {
        it('should update a user by ID', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-teacher')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-teacher`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          expect(updatedUser.status).toBe(200);
          expect(updatedUser.body).toBeDefined();
        });
      });
      describe('DELETE /user-teacher/:id', () => {
        it('should delete a user by ID', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-teacher')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const result = await supertest(app)
            .delete(`/user-teacher/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /user-worker/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-worker')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const userWorker = await supertest(app)
            .get(`/user-worker/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(userWorker.status).toBe(400);
          expect(userWorker.body.error).toBeDefined();
        });
      });
      describe('PATCH /user-worker', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-worker')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-worker`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              salary: {
                id,
                salary: 'a',
              },
            });
          expect(updatedUser.status).toBe(400);
          expect(updatedUser.body.error).toBeDefined();
        });
      });
      describe('DELETE /user-worker/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await supertest(app)
            .post('/user-worker')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const result = await supertest(app)
            .delete(`/user-worker/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /user-worker', () => {
        it('should create a user', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-worker')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-worker')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const userWorker = await supertest(app)
            .get(`/user-worker/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(userWorker.status).toBe(200);
          expect(userWorker.body).toBeDefined();
        });
      });
      describe('GET /users-worker/', () => {
        it('should find all users', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          await createAuthUserInMemory('teste2@test.com', authUserRepository);
          await supertest(app)
            .post('/user-worker')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const response = await supertest(app)
            .get('/users-worker')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-worker', () => {
        it('should update a user by ID', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-worker')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const updatedUser = await supertest(app)
            .patch(`/user-worker`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          expect(updatedUser.status).toBe(200);
          expect(updatedUser.body).toBeDefined();
        });
      });
      describe('DELETE /user-worker/:id', () => {
        it('should delete a user by ID', async () => {
          await createAuthUserInMemory('teste1@test.com', authUserRepository);
          const response = await supertest(app)
            .post('/user-worker')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const id = response.body.id;
          const result = await supertest(app)
            .delete(`/user-worker/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
});
