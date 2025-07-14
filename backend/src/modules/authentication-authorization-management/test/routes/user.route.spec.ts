import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserRoute from '../../interface/route/user.route';
import AuthUserController from '../../interface/controller/user.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';

describe('AuthUserRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let controller: AuthUserController;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    controller = {
      create: jest.fn().mockResolvedValue({
        email: 'user@example.com',
        masterId: 'abc123',
      }),
      login: jest.fn().mockResolvedValue({
        token: 'valid-token-123',
      }),
      find: jest.fn().mockResolvedValue({
        email: 'user@example.com',
        role: 'administrator',
      }),
      update: jest.fn().mockResolvedValue({
        email: 'user@example.com',
        updatedFields: ['password'],
      }),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação realizada com sucesso',
      }),
    } as unknown as AuthUserController;

    middleware = {
      handle: jest.fn((_request, next) => {
        _request.tokenData = {
          email: 'user@example.com',
          role: 'administrator',
          masterId: 'validId',
        };
        return next();
      }),
    } as unknown as AuthUserMiddleware;

    new AuthUserRoute(controller, http, middleware).routes();
  });

  describe('success', () => {
    it('should create a user', async () => {
      const response = await supertest(app).post('/register').send({
        email: 'user@example.com',
        password: '123456',
        role: 'administrator',
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        email: 'user@example.com',
        masterId: 'abc123',
      });
    });

    it('should login successfully', async () => {
      const response = await supertest(app).post('/login').send({
        email: 'user@example.com',
        password: '123456',
        role: 'administrator',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        token: 'valid-token-123',
      });
    });

    it('should find user', async () => {
      const response = await supertest(app)
        .get('/authUser/user@example.com')
        .set('Authorization', 'Bearer teste-token');

      expect(response.statusCode).toBe(200);
      expect(controller.find).toHaveBeenCalledWith(
        { email: 'user@example.com' },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );

      expect(response.body).toEqual({
        email: 'user@example.com',
        role: 'administrator',
      });
    });

    it('should update user', async () => {
      const response = await supertest(app)
        .patch('/authUser')
        .send({
          email: 'user@example.com',
          authUserDataToUpdate: { password: 'newpass' },
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        email: 'user@example.com',
        updatedFields: ['password'],
      });
    });

    it('should delete user', async () => {
      const response = await supertest(app).delete(
        '/authUser/user@example.com'
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        message: 'Operação realizada com sucesso',
      });
    });
  });

  describe('failure', () => {
    it('should return 400 for missing fields on register', async () => {
      const response = await supertest(app).post('/register').send({
        email: 'user@example.com',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid login', async () => {
      const response = await supertest(app).post('/login').send({
        email: 'invalid-email',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid email on find', async () => {
      const response = await supertest(app).get('/authUser/invalid-email');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid update input', async () => {
      const response = await supertest(app).patch('/authUser').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid email on delete', async () => {
      const response = await supertest(app).delete('/authUser/invalid-email');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });
  });
});
