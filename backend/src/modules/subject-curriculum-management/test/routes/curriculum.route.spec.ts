import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { CurriculumController } from '../../interface/controller/curriculum.controller';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { CurriculumRoute } from '../../interface/route/curriculum.route';

describe('CurriculumRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let curriculumController: jest.Mocked<CurriculumController>;
  let middleware: AuthUserMiddleware;

  const mockCurriculumData = {
    id: new Id().value,
    name: 'Math',
    subjectsList: [new Id().value, new Id().value, new Id().value],
    yearsToComplete: 5,
  };

  const mockCurriculumData2 = {
    id: new Id().value,
    name: 'Computer Science',
    subjectsList: [new Id().value, new Id().value, new Id().value, new Id().value],
    yearsToComplete: 4,
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    curriculumController = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addSubjects: jest.fn(),
      removeSubjects: jest.fn(),
    } as unknown as jest.Mocked<CurriculumController>;

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

    new CurriculumRoute(curriculumController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all curriculums', async () => {
      curriculumController.findAll.mockResolvedValue([
        mockCurriculumData,
        mockCurriculumData2,
      ]);

      const response = await supertest(app).get('/curriculums?quantity=2&offset=0');

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
      const createdId = new Id().value;
      curriculumController.create.mockResolvedValue({ id: createdId });

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
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find a curriculum by ID', async () => {
      const id = new Id().value;
      curriculumController.find.mockResolvedValue({
        ...mockCurriculumData,
        id,
      });

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
      expect(response.body).toEqual({
        ...mockCurriculumData,
        id,
      });
    });

    it('should update a curriculum by ID', async () => {
      const id = new Id().value;
      const payload = {
        id,
        yearsToComplete: 6,
      };
      curriculumController.update.mockResolvedValue({
        ...mockCurriculumData,
        ...payload,
      });

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
      expect(response.body).toEqual({
        ...mockCurriculumData,
        ...payload,
      });
    });

    it('should delete a curriculum by ID', async () => {
      curriculumController.delete.mockResolvedValue({
        message: 'Operation completed successfully',
      });
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
        message: 'Operation completed successfully',
      });
    });

    it('should add subjects to the curriculum', async () => {
      const id = new Id().value;
      const payload = {
        id,
        newSubjectsList: [new Id().value],
      };
      curriculumController.addSubjects.mockResolvedValue({
        message: '1 value was entered',
      });

      const response = await supertest(app).post(`/curriculum/subject/add`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(curriculumController.addSubjects).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: '1 value was entered' });
    });

    it('should remove subjects from the curriculum', async () => {
      const id = new Id().value;
      const payload = {
        id,
        subjectsListToRemove: [new Id().value, new Id().value],
      };
      curriculumController.removeSubjects.mockResolvedValue({
        message: '2 values were removed',
      });

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
      expect(response.body).toEqual({ message: '2 values were removed' });
    });
  });

  describe('failure', () => {
    it('should return 422 for invalid id on find', async () => {
      const response = await supertest(app).get('/curriculum/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(curriculumController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when curriculum is not found', async () => {
      curriculumController.find.mockResolvedValue(null);
      const id = new Id().value;

      const response = await supertest(app).get(`/curriculum/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/curriculum')
        .send({ id: 'invalid-id' });

      expect(response.statusCode).toBe(422);
      expect(curriculumController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/curriculum/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(curriculumController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/curriculum').send({});

      expect(response.statusCode).toBe(400);
      expect(curriculumController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on add subjects', async () => {
      const response = await supertest(app)
        .post(`/curriculum/subject/add`)
        .send({ id: 'invalid-id', newSubjectsList: [new Id().value] });

      expect(response.statusCode).toBe(422);
      expect(curriculumController.addSubjects).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on add subjects', async () => {
      const response = await supertest(app).post(`/curriculum/subject/add`).send({});

      expect(response.statusCode).toBe(400);
      expect(curriculumController.addSubjects).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on remove subjects', async () => {
      const response = await supertest(app)
        .post(`/curriculum/subject/remove`)
        .send({ id: 'invalid-id', subjectsListToRemove: [new Id().value] });

      expect(response.statusCode).toBe(422);
      expect(curriculumController.removeSubjects).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on remove subjects', async () => {
      const response = await supertest(app).post(`/curriculum/subject/remove`).send({});

      expect(response.statusCode).toBe(400);
      expect(curriculumController.removeSubjects).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
