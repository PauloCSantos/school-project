import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import EvaluationController from '@/modules/evaluation-note-attendance-management/interface/controller/evaluation.controller';
import EvaluationRoute from '@/modules/evaluation-note-attendance-management/interface/route/evaluation.route';

describe('EvaluationRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let evaluationController: jest.Mocked<EvaluationController>;
  let middleware: AuthUserMiddleware;

  const baseEvaluation = {
    teacher: new Id().value,
    lesson: new Id().value,
    type: 'Exam',
    value: 10,
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    evaluationController = {
      findAll: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<EvaluationController>;

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

    new EvaluationRoute(evaluationController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all evaluations with pagination', async () => {
      evaluationController.findAll.mockResolvedValue([
        { id: new Id().value, ...baseEvaluation },
        { id: new Id().value, ...baseEvaluation, type: 'Quiz' },
      ]);

      const response = await supertest(app).get('/evaluations?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(evaluationController.findAll).toHaveBeenCalledWith(
        { quantity: '2', offset: '0' },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should create a new evaluation', async () => {
      const createdId = new Id().value;
      evaluationController.create.mockResolvedValue({ id: createdId });

      const response = await supertest(app).post('/evaluation').send(baseEvaluation);

      expect(response.statusCode).toBe(201);
      expect(evaluationController.create).toHaveBeenCalledWith(
        baseEvaluation,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find evaluation by id', async () => {
      const id = new Id().value;
      evaluationController.find.mockResolvedValue({ id, ...baseEvaluation });

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
      expect(response.body).toEqual({ id, ...baseEvaluation });
    });

    it('should update an evaluation', async () => {
      const id = new Id().value;
      const payload = { id, value: 9 };
      evaluationController.update.mockResolvedValue({
        ...baseEvaluation,
        ...payload,
        id,
      });

      const response = await supertest(app).patch('/evaluation').send(payload);

      expect(response.statusCode).toBe(200);
      expect(evaluationController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ ...baseEvaluation, ...payload, id });
    });

    it('should delete an evaluation', async () => {
      const id = new Id().value;
      evaluationController.delete.mockResolvedValue({
        message: 'Operation completed successfully',
      });

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
      expect(response.body).toEqual({ message: 'Operation completed successfully' });
    });
  });

  describe('failure', () => {
    it('should return 422 for invalid quantity or offset', async () => {
      const response = await supertest(app).get(
        '/evaluations?quantity=2&offset="invalid"'
      );

      expect(response.statusCode).toBe(422);
      expect(evaluationController.findAll).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on find', async () => {
      const response = await supertest(app).get('/evaluation/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(evaluationController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when evaluation is not found', async () => {
      const id = new Id().value;
      evaluationController.find.mockResolvedValue(null as any);

      const response = await supertest(app).get(`/evaluation/${id}`);

      expect(response.statusCode).toBe(404);
      expect(evaluationController.find).toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid data on create', async () => {
      const response = await supertest(app).post('/evaluation').send({});

      expect(response.statusCode).toBe(400);
      expect(evaluationController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for missing id on update', async () => {
      const response = await supertest(app).patch('/evaluation').send({ value: 9 });

      expect(response.statusCode).toBe(400);
      expect(evaluationController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/evaluation')
        .send({ id: 'invalid-id', value: 9 });

      expect(response.statusCode).toBe(422);
      expect(evaluationController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/evaluation/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(evaluationController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
