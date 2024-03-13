import CreateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/createAuthUser.usecase';
import DeleteAuthUser from '@/application/usecases/authentication-authorization-management/authUser/deleteAuthUser.usecase';
import FindAuthUser from '@/application/usecases/authentication-authorization-management/authUser/findAuthUser.usecase';
import LoginAuthUser from '@/application/usecases/authentication-authorization-management/authUser/loginAuthUser.usecase';
import UpdateAuthUser from '@/application/usecases/authentication-authorization-management/authUser/updateAuthUser.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryAuthUserRepository from '@/infraestructure/repositories/authentication-authorization-management/authUser.repository';
import AuthUserController from '@/interface/controller/authentication-authorization-management/authUser.controller';
import AuthUserRoute from '@/interface/route/authentication-authorization-management/authUser.route';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';

describe('Authentication authorization management module end to end test', () => {
  let authUserRepository = new MemoryAuthUserRepository();

  let app: any;
  beforeEach(() => {
    authUserRepository = new MemoryAuthUserRepository();

    const createAuthUserUsecase = new CreateAuthUser(authUserRepository);
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
    const authUserRoute = new AuthUserRoute(authUserController, expressHttp);
    authUserRoute.routes();
    app = expressHttp.getExpressInstance();
  });

  describe('AuthUser', () => {
    describe('On error', () => {
      describe('POST /register', () => {
        it('should throw an error when the data to create an authUser is wrong', async () => {
          const response = await supertest(app).post('/register').send({
            email: 'teste@teste.com.br',
            password: 'XpA2Jjd4',
            masterId: new Id().id,
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
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().id,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const authUser = await supertest(app).get(
            `/authUser/wrongemateste.com`
          );
          expect(authUser.status).toBe(400);
          expect(authUser.body.error).toBeDefined;
        });
      });
      describe('PATCH /authUser/:email', () => {
        it('should throw an error when the data to update a authUser is wrong', async () => {
          const response = await supertest(app)
            .post('/register')
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().id,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const email = response.body.email;
          const updatedAuthUser = await supertest(app)
            .patch(`/authUser/${email}`)
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
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().id,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const result = await supertest(app).delete(`/authUser/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /login', () => {
        it('should throw an error when the data to login is wrong', async () => {
          await supertest(app).post('/register').send({
            email: 'teste@teste.com.br',
            password: 'XpA2Jjd4',
            masterId: new Id().id,
            role: 'master',
            isHashed: false,
          });
          const response = await supertest(app).post('/login').send({
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
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().id,
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
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().id,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const email = response.body.email;
          const authUser = await supertest(app).get(`/authUser/${email}`);
          expect(authUser.status).toBe(200);
          expect(authUser.body).toBeDefined();
        });
      });
      describe('PATCH /authUser/:email', () => {
        it('should update a user by email', async () => {
          const response = await supertest(app)
            .post('/register')
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().id,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const email = response.body.email;
          const updatedAuthUser = await supertest(app)
            .patch(`/authUser/${email}`)
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
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().id,
              role: 'master' as RoleUsers,
              isHashed: false,
            });
          const email = response.body.email;
          const result = await supertest(app).delete(`/authUser/${email}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
      describe('POST /login', () => {
        it('should login and received a token', async () => {
          await supertest(app).post('/register').send({
            email: 'teste@teste.com.br',
            password: 'XpA2Jjd4',
            masterId: new Id().id,
            role: 'master',
            isHashed: false,
          });
          const response = await supertest(app).post('/login').send({
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
