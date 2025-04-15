import supertest from 'supertest';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserRoute from '../../interface/route/user.route';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import AuthUserController from '../../interface/controller/user.controller';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      handle: jest.fn((_req, _res, next) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockAuthUserController = jest.fn(
  () =>
    ({
      create: jest.fn().mockResolvedValue({
        email: 'teste1@teste.com',
        masterId: new Id().value,
      }),
      find: jest.fn().mockResolvedValue({
        email: 'teste1@teste.com',
        masterId: new Id().value,
        role: 'master',
        isHashed: true,
      }),
      update: jest.fn().mockResolvedValue({
        email: 'teste1@teste.com',
        role: 'master',
      }),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
      login: jest.fn().mockResolvedValue({
        token: 'fake-jwt-token',
      }),
    }) as unknown as AuthUserController
);

describe('AuthUserRoute integration tests', () => {
  const authUserController = mockAuthUserController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const authUserRoute = new AuthUserRoute(
    authUserController,
    expressHttp,
    authUserMiddleware
  );
  authUserRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /register', () => {
    it('should create a new authUser', async () => {
      const response = await supertest(app).post('/register').send({
        email: 'teste@teste.com.br',
        password: 'XpA2Jjd4',
        role: 'master',
      });

      expect(response.status).toBe(201);
      expect(authUserController.create).toHaveBeenCalled();
      expect(response.body.email).toBeDefined();
      expect(response.body.masterId).toBeDefined();
    });
  });

  describe('GET /authUser/:email', () => {
    it('should find a user by email', async () => {
      const response = await supertest(app).get('/authUser/teste@teste.com.br');

      expect(response.status).toBe(200);
      expect(authUserController.find).toHaveBeenCalled();
      expect(response.body.email).toBe('teste1@teste.com');
      expect(response.body.role).toBe('master');
    });
  });

  describe('PATCH /authUser/:email', () => {
    it('should update user by email', async () => {
      const response = await supertest(app)
        .patch('/authUser/teste@teste.com.br')
        .send({
          password: 'novaSenhaSegura123',
        });

      expect(response.status).toBe(200);
      expect(authUserController.update).toHaveBeenCalled();
      expect(response.body.role).toBe('master');
    });
  });

  describe('DELETE /authUser/:email', () => {
    it('should delete user by email', async () => {
      const response = await supertest(app).delete(
        '/authUser/teste@teste.com.br'
      );

      expect(response.status).toBe(200);
      expect(authUserController.delete).toHaveBeenCalled();
      expect(response.body.message).toBe('Operação concluída com sucesso');
    });
  });

  describe('POST /login', () => {
    it('should authenticate and return token', async () => {
      const response = await supertest(app).post('/login').send({
        email: 'teste@teste.com.br',
        password: 'senha123',
        role: 'master',
      });

      expect(response.status).toBe(200);
      expect(authUserController.login).toHaveBeenCalled();
      expect(response.body.token).toBeDefined();
    });
  });
});
