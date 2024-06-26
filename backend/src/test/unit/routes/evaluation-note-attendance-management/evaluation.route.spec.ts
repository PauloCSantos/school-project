import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { EvaluationController } from '@/interface/controller/evaluation-note-attendance-management/evaluation.controller';
import { EvaluationRoute } from '@/interface/route/evaluation-note-attendance-management/evaluation.route';
import AuthUserMiddleware from '@/application/middleware/authUser.middleware';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      //@ts-expect-error
      handle: jest.fn((req: any, res: any, next: any) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockEvaluationController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().id }),
    find: jest.fn().mockResolvedValue({
      lesson: new Id().id,
      teacher: new Id().id,
      type: 'evaluation',
      value: 10,
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        lesson: new Id().id,
        teacher: new Id().id,
        type: 'evaluation',
        value: 10,
      },
      {
        lesson: new Id().id,
        teacher: new Id().id,
        type: 'evaluation',
        value: 10,
      },
    ]),
    update: jest.fn().mockResolvedValue({
      lesson: new Id().id,
      teacher: new Id().id,
      type: 'evaluation',
      value: 10,
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
  } as unknown as EvaluationController;
});

describe('EvaluationRoute unit test', () => {
  const evaluationController = mockEvaluationController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const evaluationRoute = new EvaluationRoute(
    evaluationController,
    expressHttp,
    authUserMiddleware
  );
  evaluationRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /evaluation', () => {
    it('should create a evaluation', async () => {
      const response = await supertest(app).post('/evaluation').send({
        lesson: new Id().id,
        teacher: new Id().id,
        type: 'evaluation',
        value: 10,
      });
      expect(response.status).toBe(201);
      expect(evaluationController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /evaluation/:id', () => {
    it('should find a evaluation by ID', async () => {
      const response = await supertest(app).get(`/evaluation/${new Id().id}`);
      expect(response.status).toBe(200);
      expect(evaluationController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /evaluations/', () => {
    it('should find all evaluations', async () => {
      const response = await supertest(app).get('/evaluations');
      expect(response.status).toBe(200);
      expect(evaluationController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /evaluation/:id', () => {
    it('should update a evaluation by ID', async () => {
      const response = await supertest(app)
        .patch(`/evaluation/${new Id().id}`)
        .send({
          description: 'New description',
        });
      expect(response.status).toBe(200);
      expect(evaluationController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /evaluation/:id', () => {
    it('should delete a evaluation by ID', async () => {
      const response = await supertest(app).delete(
        `/evaluation/${new Id().id}`
      );
      expect(response.status).toBe(200);
      expect(evaluationController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
});
