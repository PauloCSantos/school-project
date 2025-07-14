import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { CurriculumController } from '../../interface/controller/curriculum.controller';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { CurriculumRoute } from '../../interface/route/curriculum.route';

describe('CurriculumRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let curriculumController: CurriculumController;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    curriculumController = {
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          id,
          name: 'Math',
          subjectsList: [new Id().value, new Id().value, new Id().value],
          yearsToComplete: 5,
        })
      ),
      findAll: jest.fn().mockResolvedValue([
        {
          id: new Id().value,
          name: 'Math',
          subjectsList: [new Id().value, new Id().value, new Id().value],
          yearsToComplete: 5,
        },
        {
          id: new Id().value,
          name: 'Spanish',
          subjectsList: [new Id().value, new Id().value, new Id().value],
          yearsToComplete: 5,
        },
      ]),
      update: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          id,
          name: 'Math',
          yearsToComplete: 6,
        })
      ),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
      addSubjects: jest.fn().mockResolvedValue('1 value was entered'),
      removeSubjects: jest.fn().mockResolvedValue('2 values were removed'),
    } as unknown as CurriculumController;

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

    new CurriculumRoute(curriculumController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all curriculums', async () => {
      const response = await supertest(app).get('/curriculums');

      expect(response.statusCode).toBe(200);
      expect(curriculumController.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create a curriculum', async () => {
      const payload = {
        name: 'Math',
        subjectsList: [new Id().value, new Id().value, new Id().value],
        yearsToComplete: 5,
      };
      const response = await supertest(app).post('/curriculum').send(payload);

      expect(response.statusCode).toBe(201);
      expect(curriculumController.create).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find a curriculum by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/curriculum/${id}`);

      expect(response.statusCode).toBe(200);
      expect(curriculumController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should update a curriculum by ID', async () => {
      const id = new Id().value;
      const payload = { id, yearsToComplete: 6 };
      const response = await supertest(app).patch(`/curriculum`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(curriculumController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should delete a curriculum by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/curriculum/${id}`);

      expect(response.statusCode).toBe(200);
      expect(curriculumController.delete).toHaveBeenCalledWith(
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

    it('should add subjects to the curriculum', async () => {
      const id = new Id().value;
      const payload = {
        id,
        newSubjectsList: [new Id().value],
      };
      const response = await supertest(app)
        .post(`/curriculum/subject/add`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(curriculumController.addSubjects).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toBeDefined();
    });

    it('should remove subjects from the curriculum', async () => {
      const id = new Id().value;
      const payload = {
        id,
        subjectsListToRemove: [new Id().value, new Id().value],
      };
      const response = await supertest(app)
        .post(`/curriculum/subject/remove`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(curriculumController.removeSubjects).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toBeDefined();
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/curriculum/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/curriculum')
        .send({ id: 'invalid-id' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/curriculum/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/curriculum').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: expect.any(String),
      });
    });

    it('should return 400 for invalid id on add subjects', async () => {
      const id = 'invalid-id';
      const response = await supertest(app)
        .post(`/curriculum/subject/add`)
        .send({ id, newSubjectsList: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on remove subjects', async () => {
      const id = new Id().value;
      const response = await supertest(app)
        .post(`/curriculum/subject/remove`)
        .send({ id, subjectsListToRemove: 123 });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });
  });
});
