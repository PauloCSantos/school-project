import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/user.repository';
import AuthUserController from '@/modules/authentication-authorization-management/interface/controller/user.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import AuthUserRoute from '@/modules/authentication-authorization-management/interface/route/user.route';
import AuthUserService from '@/modules/authentication-authorization-management/domain/service/user-entity.service';

describe('Authentication authorization management module end to end test', () => {
  let authUserRepository = new MemoryAuthUserRepository();
  let authUserService = new AuthUserService();

  let app: any;
  beforeEach(() => {
    authUserRepository = new MemoryAuthUserRepository();

    const createAuthUserUsecase = new CreateAuthUser(
      authUserRepository,
      authUserService
    );
    const findAuthUserUsecase = new FindAuthUser(authUserRepository);
    const updateAuthUserUsecase = new UpdateAuthUser(authUserRepository);
    const deleteAuthUserUsecase = new DeleteAuthUser(authUserRepository);
    const loginAuthUserUsecase = new LoginAuthUser(authUserRepository);

    const authUserController = new AuthUserController(
      createAuthUserUsecase,
      findAuthUserUsecase,
      updateAuthUserUsecase,
      deleteAuthUserUsecase,
      loginAuthUserUsecase
    );

    const expressHttp = new ExpressHttp();
    const tokerService = tokenInstance();
    const authUserMiddlewareAuthUser = new AuthUserMiddleware(tokerService, [
      'master',
      'administrator',
      'student',
      'teacher',
    ]);
    const authUserRoute = new AuthUserRoute(
      authUserController,
      expressHttp,
      authUserMiddlewareAuthUser
    );
    authUserRoute.routes();
    app = expressHttp.getExpressInstance();
  });

  describe('AuthUser', () => {
    describe('On error', () => {
      describe('POST /register', () => {
        it('should throw an error when the data to create an authUser is wrong', async () => {
          const response = await supertest(app)
            .post('/register')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'unknow',
              isHashed: false,
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /authUser/:email', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/register')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const authUser = await supertest(app)
            .get(`/authUser/wrongemateste.com`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(authUser.status).toBe(400);
          expect(authUser.body.error).toBeDefined();
        });
      });
      describe('PATCH /authUser/:email', () => {
        it('should throw an error when the data to update a authUser is wrong', async () => {
          const response = await supertest(app)
            .post('/register')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const email = response.body.email;
          const updatedAuthUser = await supertest(app)
            .patch(`/authUser/${email}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              authUserDataToUpdate: {
                password: '',
              },
            });
          expect(updatedAuthUser.status).toBe(404);
          expect(updatedAuthUser.body.error).toBeDefined();
        });
      });
      describe('DELETE /authUser/:email', () => {
        it('should throw an error when the email is wrong or non-standard', async () => {
          await supertest(app)
            .post('/authUser')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const result = await supertest(app)
            .delete(`/authUser/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /login', () => {
        it('should throw an error when the data to login is wrong', async () => {
          await supertest(app)
            .post('/register')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master',
              isHashed: false,
            });
          const response = await supertest(app)
            .post('/login')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd6',
              role: 'master',
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /register', () => {
        it('should create an authUser', async () => {
          const response = await supertest(app)
            .post('/register')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          expect(response.status).toBe(201);
          expect(response.body.email).toBeDefined();
          expect(response.body.masterId).toBeDefined();
        });
      });
      describe('GET /authUser/:email', () => {
        it('should find a user by email', async () => {
          const response = await supertest(app)
            .post('/register')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const email = response.body.email;
          const authUser = await supertest(app)
            .get(`/authUser/${email}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(authUser.status).toBe(200);
          expect(authUser.body).toBeDefined();
        });
      });
      describe('PATCH /authUser/:email', () => {
        it('should update a user by email', async () => {
          const response = await supertest(app)
            .post('/register')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const email = response.body.email;
          const updatedAuthUser = await supertest(app)
            .patch(`/authUser/${email}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              authUserDataToUpdate: {
                password: 'as5d4v67',
              },
            });
          expect(updatedAuthUser.status).toBe(200);
          expect(updatedAuthUser.body).toBeDefined();
        });
      });
      describe('DELETE /authUser/:email', () => {
        it('should delete a user by email', async () => {
          const response = await supertest(app)
            .post('/register')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const email = response.body.email;
          const result = await supertest(app)
            .delete(`/authUser/${email}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
      describe('POST /login', () => {
        it('should login and received a token', async () => {
          await supertest(app)
            .post('/register')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master',
              isHashed: false,
            });
          const response = await supertest(app)
            .post('/login')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              role: 'master',
            });
          expect(response.status).toBe(200);
          expect(response.body.token).toBeDefined();
        });
      });
    });
  });
});
