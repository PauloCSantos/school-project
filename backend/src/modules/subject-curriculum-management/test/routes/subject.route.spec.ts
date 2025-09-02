import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { SubjectController } from '../../interface/controller/subject.controller';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { SubjectRoute } from '../../interface/route/subject.route';

describe('SubjectRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let subjectController: jest.Mocked<SubjectController>;
  let middleware: AuthUserMiddleware;

  const mockSubject = {
    id: new Id().value,
    name: 'Math',
    description: 'Described a subject',
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    subjectController = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SubjectController>;

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

    new SubjectRoute(subjectController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all subjects with pagination', async () => {
      subjectController.findAll.mockResolvedValue([
        { ...mockSubject, id: new Id().value },
        { ...mockSubject, id: new Id().value },
      ]);

      const response = await supertest(app).get('/subjects?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(subjectController.findAll).toHaveBeenCalled();
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should create a subject', async () => {
      const createdId = new Id().value;
      subjectController.create.mockResolvedValue({ id: createdId });

      const payload = { name: 'Math', description: 'Described a subject' };
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
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find a subject by ID', async () => {
      const id = new Id().value;
      subjectController.find.mockResolvedValue({ ...mockSubject, id });

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
      expect(response.body).toEqual({ ...mockSubject, id });
    });

    it('should update a subject by ID', async () => {
      const id = new Id().value;
      const payload = { id, description: 'Updated' };
      subjectController.update.mockResolvedValue({ ...mockSubject, ...payload });

      const response = await supertest(app).patch('/subject').send(payload);

      expect(response.statusCode).toBe(200);
      expect(subjectController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ ...mockSubject, ...payload });
    });

    it('should delete a subject by ID', async () => {
      const id = new Id().value;
      subjectController.delete.mockResolvedValue({
        message: 'Operação concluída com sucesso',
      });

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
      expect(response.body).toEqual({ message: 'Operação concluída com sucesso' });
    });
  });

  describe('failure', () => {
    it('should return 422 for invalid id on find', async () => {
      const response = await supertest(app).get('/subject/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(subjectController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when subject is not found', async () => {
      const id = new Id().value;
      subjectController.find.mockResolvedValue(null);

      const response = await supertest(app).get(`/subject/${id}`);

      expect(response.statusCode).toBe(404);
      expect(subjectController.find).toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on update', async () => {
      const response = await supertest(app).patch('/subject').send({ id: 'invalid-id' });

      expect(response.statusCode).toBe(422);
      expect(subjectController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/subject/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(subjectController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/subject').send({});

      expect(response.statusCode).toBe(400);
      expect(subjectController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
