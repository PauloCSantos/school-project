import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import EvaluationController from '@/modules/evaluation-note-attendance-management/interface/controller/evaluation.controller';
import EvaluationRoute from '@/modules/evaluation-note-attendance-management/interface/route/evaluation.route';

describe('EvaluationRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let evaluationController: EvaluationController;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    evaluationController = {
      findAll: jest.fn().mockResolvedValue([{ id: new Id().value }]),
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) => Promise.resolve({ id })),
      update: jest.fn().mockImplementation(({ id }) => Promise.resolve({ id })),
      delete: jest
        .fn()
        .mockResolvedValue({ message: 'Operação concluída com sucesso' }),
    } as unknown as EvaluationController;

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

    new EvaluationRoute(evaluationController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all evaluations', async () => {
      const response = await supertest(app).get(
        '/evaluations?quantity=2&offset=0'
      );
      expect(response.statusCode).toBe(200);
      expect(evaluationController.findAll).toHaveBeenCalledWith(
        {
          quantity: '2',
          offset: '0',
        },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual([{ id: expect.any(String) }]);
    });

    it('should create a new evaluation', async () => {
      const payload = {
        teacher: new Id().value,
        lesson: new Id().value,
        type: 'Exam',
        value: 10,
      };
      const response = await supertest(app).post('/evaluation').send(payload);
      expect(response.statusCode).toBe(201);
      expect(evaluationController.create).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find evaluation by id', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/evaluation/${id}`);
      expect(response.statusCode).toBe(200);
      expect(evaluationController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id });
    });

    it('should update an evaluation', async () => {
      const id = new Id().value;
      const payload = {
        id,
        value: 10,
      };
      const response = await supertest(app).patch(`/evaluation`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(evaluationController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id });
    });

    it('should delete an evaluation', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/evaluation/${id}`);

      expect(response.statusCode).toBe(200);
      expect(evaluationController.delete).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid quantity or offset', async () => {
      const response = await supertest(app).get(
        '/evaluations?quantity=2&offset="invalid"'
      );

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/evaluation/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/evaluation').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/evaluation/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });
  });
});
