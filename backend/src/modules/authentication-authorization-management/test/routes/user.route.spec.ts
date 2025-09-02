import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserRoute from '../../interface/route/user.route';
import AuthUserController from '../../interface/controller/user.controller';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';

describe('AuthUserRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let controller: jest.Mocked<AuthUserController>;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    controller = {
      create: jest.fn(),
      login: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<AuthUserController>;

    middleware = {
      handle: jest.fn((_request: any, next: any) => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should create a user', async () => {
      controller.create.mockResolvedValue({
        email: 'user@example.com',
        masterId: 'abc123',
      });

      const response = await supertest(app).post('/register').send({
        email: 'user@example.com',
        password: '123456',
        role: 'administrator',
      });

      expect(response.statusCode).toBe(201);
      expect(controller.create).toHaveBeenCalledWith(
        {
          email: 'user@example.com',
          password: '123456',
          role: 'administrator',
        },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        email: 'user@example.com',
        masterId: 'abc123',
      });
    });

    it('should login successfully', async () => {
      controller.login.mockResolvedValue({ token: 'valid-token-123' });

      const response = await supertest(app).post('/login').send({
        email: 'user@example.com',
        password: '123456',
        role: 'administrator',
      });

      expect(response.statusCode).toBe(200);
      expect(controller.login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: '123456',
        role: 'administrator',
      });
      expect(response.body).toEqual({ token: 'valid-token-123' });
    });

    it('should find user', async () => {
      controller.find.mockResolvedValue({
        email: 'user@example.com',
      });

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
      });
    });

    it('should update user', async () => {
      controller.update.mockResolvedValue({
        email: 'user@example.com',
        role: 'master' as RoleUsers,
      });

      const payload = {
        email: 'user@example.com',
        authUserDataToUpdate: { password: 'newpass' },
      };
      const response = await supertest(app).patch('/authUser').send(payload);

      expect(response.statusCode).toBe(200);
      expect(controller.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        email: 'user@example.com',
        role: 'master',
      });
    });

    it('should delete user', async () => {
      controller.delete.mockResolvedValue({
        message: 'Operação realizada com sucesso',
      });

      const response = await supertest(app).delete('/authUser/user@example.com');

      expect(response.statusCode).toBe(200);
      expect(controller.delete).toHaveBeenCalledWith(
        { email: 'user@example.com' },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
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
      expect(controller.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid login payload', async () => {
      const response = await supertest(app).post('/login').send({
        email: 'user@example.com',
      });

      expect(response.statusCode).toBe(400);
      expect(controller.login).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid email on find', async () => {
      const response = await supertest(app).get('/authUser/invalid-email');

      expect(response.statusCode).toBe(422);
      expect(controller.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid update input (missing fields)', async () => {
      const response = await supertest(app).patch('/authUser').send({});

      expect(response.statusCode).toBe(400);
      expect(controller.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid email in update payload', async () => {
      const response = await supertest(app)
        .patch('/authUser')
        .send({
          email: 'invalid-email',
          authUserDataToUpdate: { password: 'newpass' },
        });

      expect(response.statusCode).toBe(422);
      expect(controller.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid email on delete', async () => {
      const response = await supertest(app).delete('/authUser/invalid-email');

      expect(response.statusCode).toBe(422);
      expect(controller.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when user is not found on find', async () => {
      controller.find.mockResolvedValue(null as any);

      const response = await supertest(app).get('/authUser/user@example.com');

      expect(response.statusCode).toBe(404);
      expect(controller.find).toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
