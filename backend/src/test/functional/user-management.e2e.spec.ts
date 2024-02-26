import CreateUserAdministrator from '@/application/usecases/user-management/administrator/createUserAdministrator.usecase';
import DeleteUserAdministrator from '@/application/usecases/user-management/administrator/deleteUserAdministrator.usecase';
import FindAllUserAdministrator from '@/application/usecases/user-management/administrator/findAllUserAdministrator.usecase';
import FindUserAdministrator from '@/application/usecases/user-management/administrator/findUserAdministrator.usecase';
import UpdateUserAdministrator from '@/application/usecases/user-management/administrator/updateUserAdministrator.usecase';
import CreateUserMaster from '@/application/usecases/user-management/master/createUserMaster.usecase';
import FindUserMaster from '@/application/usecases/user-management/master/findUserMaster.usecase';
import UpdateUserMaster from '@/application/usecases/user-management/master/updateUserMaster.usecase';
import CreateUserStudent from '@/application/usecases/user-management/student/createUserStudent.usecase';
import DeleteUserStudent from '@/application/usecases/user-management/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/application/usecases/user-management/student/findAllUserStudent.usecase';
import FindUserStudent from '@/application/usecases/user-management/student/findUserStudent.usecase';
import UpdateUserStudent from '@/application/usecases/user-management/student/updateUserStudent.usecase';
import CreateUserTeacher from '@/application/usecases/user-management/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '@/application/usecases/user-management/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '@/application/usecases/user-management/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '@/application/usecases/user-management/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '@/application/usecases/user-management/teacher/updateUserTeacher.usecase';
import CreateUserWorker from '@/application/usecases/user-management/worker/createUserWorker.usecase';
import DeleteUserWorker from '@/application/usecases/user-management/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '@/application/usecases/user-management/worker/findAllUserWorker.usecase';
import FindUserWorker from '@/application/usecases/user-management/worker/findUserWorker.usecase';
import UpdateUserWorker from '@/application/usecases/user-management/worker/updateUserWorker.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryUserAdministratorRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-administrator.repository';
import MemoryUserMasterRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-master.repository';
import MemoryUserStudentRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-student.repository';
import MemoryUserTeacherRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-teacher.repository';
import MemoryUserWorkerRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-worker.repository';
import { UserAdministratorController } from '@/interface/controller/user-management/user-administrator.controller';
import { UserMasterController } from '@/interface/controller/user-management/user-master.controller';
import { UserStudentController } from '@/interface/controller/user-management/user-student.controller';
import { UserTeacherController } from '@/interface/controller/user-management/user-teacher.controller';
import { UserWorkerController } from '@/interface/controller/user-management/user-worker.controller';
import { UserAdministratorRoute } from '@/interface/route/user-management/user-administrator.route';
import { UserMasterRoute } from '@/interface/route/user-management/user-master.route';
import { UserStudentRoute } from '@/interface/route/user-management/user-student.route';
import { UserTeacherRoute } from '@/interface/route/user-management/user-teacher.route';
import { UserWorkerRoute } from '@/interface/route/user-management/user-worker.route';
import supertest from 'supertest';

describe('User management module end to end test', () => {
  let userAdministratorRepository = new MemoryUserAdministratorRepository();
  let userMasterRepository = new MemoryUserMasterRepository();
  let userStudentRepository = new MemoryUserStudentRepository();
  let userTeacherRepository = new MemoryUserTeacherRepository();
  let userWorkerRepository = new MemoryUserWorkerRepository();
  let app: any;
  beforeEach(() => {
    userAdministratorRepository = new MemoryUserAdministratorRepository();
    userMasterRepository = new MemoryUserMasterRepository();
    userStudentRepository = new MemoryUserStudentRepository();
    userTeacherRepository = new MemoryUserTeacherRepository();
    userWorkerRepository = new MemoryUserWorkerRepository();
    const createUserAdministratorUsecase = new CreateUserAdministrator(
      userAdministratorRepository
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
    const createUserMasterUsecase = new CreateUserMaster(userMasterRepository);
    const findUserMasterUsecase = new FindUserMaster(userMasterRepository);
    const updateUserMasterUsecase = new UpdateUserMaster(userMasterRepository);

    const createUserStudentUsecase = new CreateUserStudent(
      userStudentRepository
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
      userTeacherRepository
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

    const createUserWorkerUsecase = new CreateUserWorker(userWorkerRepository);
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
    const expressHttp = new ExpressHttp();
    const userAdministratorRoute = new UserAdministratorRoute(
      userAdministratorController,
      expressHttp
    );
    const userMasterRoute = new UserMasterRoute(
      userMasterController,
      expressHttp
    );
    const userStudentRoute = new UserStudentRoute(
      userStudentController,
      expressHttp
    );
    const userTeacherRoute = new UserTeacherRoute(
      userTeacherController,
      expressHttp
    );
    const userWorkerRoute = new UserWorkerRoute(
      userWorkerController,
      expressHttp
    );

    userAdministratorRoute.routes();
    userMasterRoute.routes();
    userStudentRoute.routes();
    userTeacherRoute.routes();
    userWorkerRoute.routes();
    app = expressHttp.getExpressInstance();
  });

  describe('User administrator', () => {
    describe('On error', () => {
      describe('POST /user-administrator', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          const response = await supertest(app)
            .post('/user-administrator')
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
          await supertest(app)
            .post('/user-administrator')
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
          const userAdministrator = await supertest(app).get(
            `/user-administrator/123`
          );
          expect(userAdministrator.status).toBe(400);
          expect(userAdministrator.body.error).toBeDefined;
        });
      });
      describe('PATCH /user-administrator/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app)
            .post('/user-administrator')
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
            .patch(`/user-administrator/${id}`)
            .send({
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
          await supertest(app)
            .post('/user-administrator')
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
          const result = await supertest(app).delete(`/user-administrator/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /user-administrator', () => {
        it('should create a user', async () => {
          const response = await supertest(app)
            .post('/user-administrator')
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
          const response = await supertest(app)
            .post('/user-administrator')
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
          const userAdministrator = await supertest(app).get(
            `/user-administrator/${id}`
          );
          expect(userAdministrator.status).toBe(200);
          expect(userAdministrator.body).toBeDefined();
        });
      });
      describe('GET /user-administrators/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/user-administrator')
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
              email: 'teste1@test.com',
              graduation: 'Spanish',
            });
          const response = await supertest(app).get('/user-administrators');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-administrator/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-administrator')
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
            .patch(`/user-administrator/${id}`)
            .send({
              address: {
                street: 'Street B',
                city: 'City B',
                zip: '111111-111',
                number: 1,
                avenue: 'Avenue B',
                state: 'State B',
              },
              birthday: '01/01/2020',
            });
          expect(updatedUser.status).toBe(200);
          expect(updatedUser.body).toBeDefined();
        });
      });
      describe('DELETE /user-administrator/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-administrator')
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
          const result = await supertest(app).delete(
            `/user-administrator/${id}`
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
          const response = await supertest(app)
            .post('/user-master')
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
          await supertest(app)
            .post('/user-master')
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
          const userMaster = await supertest(app).get(`/user-masters/123`);
          expect(userMaster.status).toBe(404);
          expect(userMaster.body.error).toBeDefined;
        });
      });
      describe('PATCH /user-master/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app)
            .post('/user-master')
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
            .patch(`/user-master/${id}`)
            .send({
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
          const response = await supertest(app)
            .post('/user-master')
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
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /user-master/:id', () => {
        it('should find a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-master')
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
          const userMaster = await supertest(app).get(`/user-master/${id}`);
          expect(userMaster.status).toBe(200);
          expect(userMaster.body).toBeDefined();
        });
      });
      describe('PATCH /user-master/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-master')
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
            .patch(`/user-master/${id}`)
            .send({
              email: 'teste2@test.com',
              cnpj: '35.845.901/0001-58',
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
          const response = await supertest(app)
            .post('/user-student')
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
          await supertest(app)
            .post('/user-student')
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
          const userStudent = await supertest(app).get(`/user-student/123`);
          expect(userStudent.status).toBe(400);
          expect(userStudent.body.error).toBeDefined;
        });
      });
      describe('PATCH /user-student/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app)
            .post('/user-student')
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
            .patch(`/user-student/${id}`)
            .send({
              paymentYear: 0,
              birthday: '18/02/2024',
            });
          expect(updatedUser.status).toBe(400);
          expect(updatedUser.body.error).toBeDefined();
        });
      });
      describe('DELETE /user-student/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/user-student')
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
          const result = await supertest(app).delete(`/user-student/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /user-student', () => {
        it('should create a user', async () => {
          const response = await supertest(app)
            .post('/user-student')
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
          const response = await supertest(app)
            .post('/user-student')
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
          const userStudent = await supertest(app).get(`/user-student/${id}`);
          expect(userStudent.status).toBe(200);
          expect(userStudent.body).toBeDefined();
        });
      });
      describe('GET /user-students/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/user-student')
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
          const response = await supertest(app).get('/user-students');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-student/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-student')
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
            .patch(`/user-student/${id}`)
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
          expect(updatedUser.status).toBe(200);
          expect(updatedUser.body).toBeDefined();
        });
      });
      describe('DELETE /user-student/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-student')
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
          const result = await supertest(app).delete(`/user-student/${id}`);
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
          const response = await supertest(app)
            .post('/user-teacher')
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
          await supertest(app)
            .post('/user-teacher')
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
          const userTeacher = await supertest(app).get(`/user-teacher/123`);
          expect(userTeacher.status).toBe(400);
          expect(userTeacher.body.error).toBeDefined;
        });
      });
      describe('PATCH /user-teacher/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app)
            .post('/user-teacher')
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
            .patch(`/user-teacher/${id}`)
            .send({
              academicDegrees: 0,
              birthday: '02/20/2024',
            });
          expect(updatedUser.status).toBe(400);
          expect(updatedUser.body.error).toBeDefined();
        });
      });
      describe('DELETE /user-teacher/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/user-teacher')
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
          const result = await supertest(app).delete(`/user-teacher/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /user-teacher', () => {
        it('should create a user', async () => {
          const response = await supertest(app)
            .post('/user-teacher')
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
          const response = await supertest(app)
            .post('/user-teacher')
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
          const userTeacher = await supertest(app).get(`/user-teacher/${id}`);
          expect(userTeacher.status).toBe(200);
          expect(userTeacher.body).toBeDefined();
        });
      });
      describe('GET /user-teachers/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/user-teacher')
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
          const response = await supertest(app).get('/user-teachers');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-teacher/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-teacher')
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
            .patch(`/user-teacher/${id}`)
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
          expect(updatedUser.status).toBe(200);
          expect(updatedUser.body).toBeDefined();
        });
      });
      describe('DELETE /user-teacher/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-teacher')
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
          const result = await supertest(app).delete(`/user-teacher/${id}`);
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
          const response = await supertest(app)
            .post('/user-worker')
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
          await supertest(app)
            .post('/user-worker')
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
          const userWorker = await supertest(app).get(`/user-worker/123`);
          expect(userWorker.status).toBe(400);
          expect(userWorker.body.error).toBeDefined;
        });
      });
      describe('PATCH /user-worker/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app)
            .post('/user-worker')
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
            .patch(`/user-worker/${id}`)
            .send({
              salary: {
                salary: 'a',
              },
            });
          expect(updatedUser.status).toBe(400);
          expect(updatedUser.body.error).toBeDefined();
        });
      });
      describe('DELETE /user-worker/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/user-worker')
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
          const result = await supertest(app).delete(`/user-worker/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /user-worker', () => {
        it('should create a user', async () => {
          const response = await supertest(app)
            .post('/user-worker')
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
          const response = await supertest(app)
            .post('/user-worker')
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
          const userWorker = await supertest(app).get(`/user-worker/${id}`);
          expect(userWorker.status).toBe(200);
          expect(userWorker.body).toBeDefined();
        });
      });
      describe('GET /user-workers/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/user-worker')
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
          const response = await supertest(app).get('/user-workers');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /user-worker/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-worker')
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
            .patch(`/user-worker/${id}`)
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
          expect(updatedUser.status).toBe(200);
          expect(updatedUser.body).toBeDefined();
        });
      });
      describe('DELETE /user-worker/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/user-worker')
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
          const result = await supertest(app).delete(`/user-worker/${id}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
});
