import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/create-user.usecase';
import DeleteAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/delete-user.usecase';
import FindAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/find-user.usecase';
import LoginAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/login-user.usecase';
import UpdateAuthUser from '@/modules/authentication-authorization-management/application/usecases/authUser/update-user.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserController from '@/modules/authentication-authorization-management/interface/controller/user.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import AuthUserRoute from '@/modules/authentication-authorization-management/interface/route/user.route';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryTenantRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/tenant.gateway';
import { TenantService } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

async function registerAndLoginUser(app: any, userDataOverride = {}) {
  const defaultUserData = {
    email: 'teste@teste.com.br',
    password: 'XpA2Jjd4',
    role: 'master' as RoleUsers,
    cnpj: '12345678000111',
  };

  const userData = { ...defaultUserData, ...userDataOverride };

  const registerResponse = await supertest(app)
    .post('/register')
    .send(userData);

  const loginResponse = await supertest(app).post('/login').send({
    email: userData.email,
    password: userData.password,
    role: userData.role,
    masterId: registerResponse.body.masterId,
  });

  return {
    token: loginResponse.body.token,
    email: userData.email,
    masterId: registerResponse.body.masterId,
    registerResponse,
    loginResponse,
  };
}

describe('Authentication authorization management module end to end test', () => {
  let authUserRepository = new MemoryAuthUserRepository();
  let tenantRepository = new MemoryTenantRepository();
  let authUserService = new AuthUserService();
  let tenantService = new TenantService(tenantRepository);
  const tokenService = new TokenService('PxHf3H7');

  let app: any;

  beforeEach(() => {
    authUserRepository = new MemoryAuthUserRepository();
    tenantRepository = new MemoryTenantRepository();
    tenantService = new TenantService(tenantRepository);
    const policiesService = new PoliciesService();

    const createAuthUserUsecase = new CreateAuthUser(
      authUserRepository,
      tenantRepository,
      authUserService,
      tenantService,
      policiesService
    );
    const findAuthUserUsecase = new FindAuthUser(
      authUserRepository,
      policiesService
    );
    const updateAuthUserUsecase = new UpdateAuthUser(
      authUserRepository,
      tenantRepository,
      authUserService,
      tenantService,
      policiesService
    );
    const deleteAuthUserUsecase = new DeleteAuthUser(
      authUserRepository,
      policiesService
    );
    const loginAuthUserUsecase = new LoginAuthUser(
      authUserRepository,
      authUserService,
      tokenService,
      tenantService
    );

    const authUserController = new AuthUserController(
      createAuthUserUsecase,
      findAuthUserUsecase,
      updateAuthUserUsecase,
      deleteAuthUserUsecase,
      loginAuthUserUsecase
    );

    const expressHttp = new ExpressAdapter();
    const tokenServiceInstance = tokenInstance();
    const authUserMiddlewareAuthUser = new AuthUserMiddleware(
      tokenServiceInstance,
      [
        RoleUsersEnum.MASTER,
        RoleUsersEnum.ADMINISTRATOR,
        RoleUsersEnum.STUDENT,
        RoleUsersEnum.TEACHER,
        RoleUsersEnum.WORKER,
      ]
    );
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
          const response = await supertest(app).post('/register').send({
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
          const { token } = await registerAndLoginUser(app);

          const authUser = await supertest(app)
            .get(`/authUser/wrongemateste.com`)
            .set('authorization', `Bearer ${token}`);

          expect(authUser.status).toBe(400);
          expect(authUser.body.error).toBeDefined();
        });
      });

      describe('PATCH /authUser', () => {
        it('should throw an error when the data to update a authUser is wrong', async () => {
          const { token } = await registerAndLoginUser(app);

          await supertest(app)
            .post('/register')
            .set('authorization', token)
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });

          const updatedAuthUser = await supertest(app)
            .patch(`/authUser`)
            .set('authorization', token)
            .send({
              email: 'teste@teste.com.br',
              authUserDataToUpdate: {
                password: '',
              },
            });

          expect(updatedAuthUser.status).toBe(400);
          expect(updatedAuthUser.body.error).toBeDefined();
        });
      });

      describe('DELETE /authUser/:email', () => {
        it('should throw an error when the email is wrong or non-standard', async () => {
          const { token } = await registerAndLoginUser(app);

          await supertest(app)
            .post('/authUser')
            .set('authorization', token)
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });

          const result = await supertest(app)
            .delete(`/authUser/123`)
            .set('authorization', token);

          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });

      describe('POST /login', () => {
        it('should throw an error when the data to login is wrong', async () => {
          const { token } = await registerAndLoginUser(app);

          await supertest(app)
            .post('/register')
            .set('authorization', token)
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master',
              isHashed: false,
            });

          const response = await supertest(app)
            .post('/login')
            .set('authorization', token)
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd6', // senha errada
              role: 'master',
            });

          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
    });

    describe('On success', () => {
      describe('POST /register', () => {
        it('should create an authUser', async () => {
          const response = await supertest(app)
            .post('/register')
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

      describe('GET /authUser/:email', () => {
        it('should find a user by email', async () => {
          const { token, email } = await registerAndLoginUser(app);

          const authUser = await supertest(app)
            .get(`/authUser/${email}`)
            .set('authorization', token);

          expect(authUser.status).toBe(200);
          expect(authUser.body).toBeDefined();
        });
      });

      describe('PATCH /authUser/:email', () => {
        it('should update a user by email', async () => {
          const { token } = await registerAndLoginUser(app);

          await supertest(app)
            .post('/register')
            .set('authorization', token)
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });

          const updatedAuthUser = await supertest(app)
            .patch(`/authUser`)
            .set('authorization', token)
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
          const { token } = await registerAndLoginUser(app);

          await supertest(app)
            .post('/register')
            .set('authorization', token)
            .send({
              email: 'teste@teste.com.br',
              password: 'XpA2Jjd4',
              masterId: new Id().value,
              role: 'master' as RoleUsers,
              isHashed: false,
            });

          const result = await supertest(app)
            .delete(`/authUser/teste@teste.com.br`)
            .set('authorization', token);

          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });

      describe('POST /login', () => {
        it('should login and receive a token', async () => {
          const { token } = await registerAndLoginUser(app);

          expect(token).toBeDefined();
        });
      });
    });
  });
});
