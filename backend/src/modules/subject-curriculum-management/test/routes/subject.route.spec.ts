import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { SubjectController } from '../../interface/controller/subject.controller';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { SubjectRoute } from '../../interface/route/subject.route';

describe('SubjectRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let subjectController: SubjectController;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    subjectController = {
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          id,
          name: 'Math',
          description: 'Described a subject',
        })
      ),
      findAll: jest.fn().mockResolvedValue([
        {
          id: new Id().value,
          name: 'Math',
          description: 'Described a subject',
        },
        {
          id: new Id().value,
          name: 'Spanish',
          description: 'Described a subject',
        },
      ]),
      update: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          id,
          name: 'Math',
          description: 'Updated description',
        })
      ),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as SubjectController;

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

    new SubjectRoute(subjectController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all subjects', async () => {
      const response = await supertest(app).get('/subjects');

      expect(response.statusCode).toBe(200);
      expect(subjectController.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create a subject', async () => {
      const payload = {
        name: 'Math',
        description: 'Described a subject',
      };
      const response = await supertest(app).post('/subject').send(payload);

      expect(response.statusCode).toBe(201);
      expect(subjectController.create).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find a subject by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/subject/${id}`);

      expect(response.statusCode).toBe(200);
      expect(subjectController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should update a subject by ID', async () => {
      const id = new Id().value;
      const payload = { id, description: 'New description' };
      const response = await supertest(app).patch(`/subject`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(subjectController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should delete a subject by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/subject/${id}`);

      expect(response.statusCode).toBe(200);
      expect(subjectController.delete).toHaveBeenCalledWith(
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
    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/subject/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/subject').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/subject/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/subject').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: expect.any(String),
      });
    });
  });
});
