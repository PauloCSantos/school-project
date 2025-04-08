import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { SubjectController } from '../../interface/controller/subject.controller';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import { SubjectRoute } from '../../interface/route/subject.route';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      //@ts-expect-error
      handle: jest.fn((req: any, res: any, next: any) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockSubjectController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().value }),
    find: jest.fn().mockResolvedValue({
      name: 'Math',
      description: 'Described a subject',
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        name: 'Math',
        description: 'Described a subject',
      },
      {
        name: 'Spanish',
        description: 'Described a subject',
      },
    ]),
    update: jest.fn().mockResolvedValue({
      name: 'Math',
      subjectsList: [new Id().value, new Id().value, new Id().value],
      yearsToComplete: 5,
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
  } as unknown as SubjectController;
});

describe('SubjectRoute unit test', () => {
  const subjectController = mockSubjectController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const subjectRoute = new SubjectRoute(
    subjectController,
    expressHttp,
    authUserMiddleware
  );
  subjectRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /subject', () => {
    it('should create a subject', async () => {
      const response = await supertest(app).post('/subject').send({
        name: 'Math',
        description: 'Described a subject',
      });
      expect(response.status).toBe(201);
      expect(subjectController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /subject/:id', () => {
    it('should find a subject by ID', async () => {
      const response = await supertest(app).get(`/subject/${new Id().value}`);
      expect(response.status).toBe(200);
      expect(subjectController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /subject/', () => {
    it('should find all subjects', async () => {
      const response = await supertest(app).get('/subjects');
      expect(response.status).toBe(200);
      expect(subjectController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /subject/:id', () => {
    it('should update a subject by ID', async () => {
      const response = await supertest(app)
        .patch(`/subject/${new Id().value}`)
        .send({
          description: 'New description',
        });
      expect(response.status).toBe(200);
      expect(subjectController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /subject/:id', () => {
    it('should delete a subject by ID', async () => {
      const response = await supertest(app).delete(
        `/subject/${new Id().value}`
      );
      expect(response.status).toBe(200);
      expect(subjectController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
});
