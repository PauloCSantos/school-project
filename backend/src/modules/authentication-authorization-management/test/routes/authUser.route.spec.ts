import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import AuthUserController from '../../interface/controller/authUser.controller';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express-http';
import AuthUserRoute from '../../interface/route/authUser.route';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      //@ts-expect-error
      handle: jest.fn((req: any, res: any, next: any) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockAuthUserController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({
      email: 'teste1@teste.com',
      masterId: new Id().id,
    }),
    find: jest.fn().mockResolvedValue({
      email: 'teste1@teste.com',
      masterId: new Id().id,
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
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6Ijk1MzIwYWU4LWNjMDItNDEwMy1iZjZkLThlYjEwYjc3NWJhMSIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcwOTkyNDIyNiwiZXhwIjoxNzA5OTI2MDI2fQ.QCuJ6riJEe6m-7r-qkeZKI9JxvyVQJfNASHuc1GrVgg',
    }),
  } as unknown as AuthUserController;
});

describe('AuthUserRoute unit test', () => {
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

  describe('POST /authUser', () => {
    it('should create a authUser', async () => {
      const response = await supertest(app)
        .post('/register')
        .send({
          email: 'teste@teste.com.br',
          password: 'XpA2Jjd4',
          role: 'master' as RoleUsers,
          isHashed: false,
        });
      expect(response.status).toBe(201);
      expect(authUserController.create).toHaveBeenCalled();
      expect(response.body.email).toBeDefined();
      expect(response.body.masterId).toBeDefined();
    });
  });
  describe('GET /authUser/:email', () => {
    it('should find a authUser by email', async () => {
      const response = await supertest(app).get(`/authUser/teste@teste.com.br`);
      expect(response.status).toBe(200);
      expect(authUserController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('PATCH /authUser/:email', () => {
    it('should update a authUser by email', async () => {
      const response = await supertest(app)
        .patch(`/authUser/teste@teste.com.br`)
        .send({
          email: 'teste@teste.com.br',
          authUserDataToUpdate: {
            password: 'as5d4v',
          },
        });
      expect(response.status).toBe(200);
      expect(authUserController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /authUser/:email', () => {
    it('should delete a authUser by email', async () => {
      const response = await supertest(app).delete(
        `/authUser/teste@teste.com.br`
      );
      expect(response.status).toBe(200);
      expect(authUserController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
  describe('POST /login', () => {
    it('should login and receive a token', async () => {
      const response = await supertest(app).post(`/login`).send({
        email: 'teste@teste.com.br',
        password: 'as5d4a5d4',
        role: 'master',
      });
      expect(response.status).toBe(200);
      expect(authUserController.login).toHaveBeenCalled();
      expect(response.body.token).toBeDefined();
    });
  });
});
