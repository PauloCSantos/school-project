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
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';

import { TenantService } from '@/modules/authentication-authorization-management/domain/service/tenant.service';
import MemoryTenantRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/tenant.repository';

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
    email: userData.email,
    masterId: registerResponse.body.masterId,
    registerResponse,
    loginResponse,
  };
}

describe('Authentication authorization management module end to end test', () => {
  let authUserService = new AuthUserService();
  let authUserRepository = new MemoryAuthUserRepository(authUserService);
  let tenantRepository = new MemoryTenantRepository();
  let tenantService = new TenantService(tenantRepository);
  const tokenService = new TokenService('secretkey');

  let app: any;

  beforeEach(() => {
    authUserRepository = new MemoryAuthUserRepository(authUserService);
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
    const deleteAuthUserUsecase = new DeleteAuthUser(authUserRepository, policiesService);
    const loginAuthUserUsecase = new LoginAuthUser(
      authUserRepository,
      authUserService,
      tokenService,
      tenantService
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
      loginAuthUserUsecase
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

          const result = await supertest(app)
            .get(`/authUser/${email}`)
            .set('authorization', `Bearer ${token}`);

          expect(result.status).toBe(200);
          expect(result.body.email).toBeDefined();
        });
      });

      describe('PATCH /authUser', () => {
        it('should update a authUser', async () => {
          const { token } = await registerAndLoginUser(app);

          const result = await supertest(app)
            .patch('/authUser')
            .send({
              email: 'teste@teste.com.br',
              authUserDataToUpdate: { password: 'XpA2Jjd4' },
            })
            .set('authorization', token);

          expect(result.status).toBe(200);
          expect(result.body.email).toBeDefined();
        });
      });

      describe('DELETE /authUser/:email', () => {
        it('should delete a authUser', async () => {
          const { token, email } = await registerAndLoginUser(app);

          const result = await supertest(app)
            .delete(`/authUser/${email}`)
            .set('authorization', token);

          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operation completed successfully');
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
