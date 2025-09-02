import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { LessonController } from '../../interface/controller/lesson.controller';
import LessonRoute from '../../interface/route/lesson.route';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';

describe('LessonRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let lessonController: jest.Mocked<LessonController>;
  let middleware: AuthUserMiddleware;

  const baseLesson = {
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().value,
    studentsList: [new Id().value, new Id().value, new Id().value],
    subject: new Id().value,
    days: ['mon', 'fri'],
    times: ['15:55', '19:00'],
    semester: 2 as 1 | 2,
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    lessonController = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addStudents: jest.fn(),
      removeStudents: jest.fn(),
      addDay: jest.fn(),
      removeDay: jest.fn(),
      addTime: jest.fn(),
      removeTime: jest.fn(),
    } as unknown as jest.Mocked<LessonController>;

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

    new LessonRoute(lessonController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all lessons with pagination', async () => {
      lessonController.findAll.mockResolvedValue([
        { id: new Id().value, ...baseLesson },
        { id: new Id().value, ...baseLesson, name: 'Math advanced II' },
      ]);

      const response = await supertest(app).get('/lessons?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(lessonController.findAll).toHaveBeenCalledWith(
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

    it('should create a lesson', async () => {
      const createdId = new Id().value;
      lessonController.create.mockResolvedValue({ id: createdId });

      const response = await supertest(app).post('/lesson').send(baseLesson);

      expect(response.statusCode).toBe(201);
      expect(lessonController.create).toHaveBeenCalledWith(
        baseLesson,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find a lesson by ID', async () => {
      const id = new Id().value;
      lessonController.find.mockResolvedValue({ id, ...baseLesson });

      const response = await supertest(app).get(`/lesson/${id}`);

      expect(response.statusCode).toBe(200);
      expect(lessonController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id, ...baseLesson });
    });

    it('should update a lesson by ID', async () => {
      const id = new Id().value;
      const payload = { id, duration: 50 };
      lessonController.update.mockResolvedValue({ ...baseLesson, ...payload, id });

      const response = await supertest(app).patch('/lesson').send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ ...baseLesson, ...payload, id });
    });

    it('should delete a lesson by ID', async () => {
      const id = new Id().value;
      lessonController.delete.mockResolvedValue({
        message: 'Operação concluída com sucesso',
      });

      const response = await supertest(app).delete(`/lesson/${id}`);

      expect(response.statusCode).toBe(200);
      expect(lessonController.delete).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: 'Operação concluída com sucesso' });
    });

    it('should add students to the lesson', async () => {
      const id = new Id().value;
      const payload = { id, newStudentsList: [new Id().value] };
      lessonController.addStudents.mockResolvedValue({ message: '1 value was entered' });

      const response = await supertest(app).post('/lesson/student/add').send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.addStudents).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: '1 value was entered' });
    });

    it('should remove students from the lesson', async () => {
      const id = new Id().value;
      const payload = { id, studentsListToRemove: [new Id().value, new Id().value] };
      lessonController.removeStudents.mockResolvedValue({
        message: '2 values were removed',
      });

      const response = await supertest(app).post('/lesson/student/remove').send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.removeStudents).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: '2 values were removed' });
    });

    it('should add day to the lesson', async () => {
      const id = new Id().value;
      const payload = { id, newDaysList: ['sun'] };
      lessonController.addDay.mockResolvedValue({ message: '1 value was entered' });

      const response = await supertest(app).post('/lesson/day/add').send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.addDay).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: '1 value was entered' });
    });

    it('should remove days from the lesson', async () => {
      const id = new Id().value;
      const payload = { id, daysListToRemove: ['mon', 'fri'] };
      lessonController.removeDay.mockResolvedValue({ message: '2 values were removed' });

      const response = await supertest(app).post('/lesson/day/remove').send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.removeDay).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: '2 values were removed' });
    });

    it('should add time to the lesson', async () => {
      const id = new Id().value;
      const payload = { id, newTimesList: ['22:00'] };
      lessonController.addTime.mockResolvedValue({ message: '1 value was entered' });

      const response = await supertest(app).post('/lesson/time/add').send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.addTime).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: '1 value was entered' });
    });

    it('should remove time from the lesson', async () => {
      const id = new Id().value;
      const payload = { id, timesListToRemove: ['13:00', '19:00'] };
      lessonController.removeTime.mockResolvedValue({ message: '2 values were removed' });

      const response = await supertest(app).post('/lesson/time/remove').send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.removeTime).toHaveBeenCalledWith(
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
    it('should return 422 for invalid quantity or offset', async () => {
      const response = await supertest(app).get('/lessons?offset=invalid');

      expect(response.statusCode).toBe(422);
      expect(lessonController.findAll).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on find', async () => {
      const response = await supertest(app).get('/lesson/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(lessonController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when lesson is not found', async () => {
      const id = new Id().value;
      lessonController.find.mockResolvedValue(null);

      const response = await supertest(app).get(`/lesson/${id}`);

      expect(response.statusCode).toBe(404);
      expect(lessonController.find).toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/lesson').send({});

      expect(response.statusCode).toBe(400);
      expect(lessonController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on update (missing id)', async () => {
      const response = await supertest(app).patch('/lesson').send({ duration: 50 });

      expect(response.statusCode).toBe(400);
      expect(lessonController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/lesson')
        .send({ id: 'invalid-id', duration: 50 });

      expect(response.statusCode).toBe(422);
      expect(lessonController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/lesson/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(lessonController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid add-students payload', async () => {
      const response = await supertest(app).post('/lesson/student/add').send({});

      expect(response.statusCode).toBe(400);
      expect(lessonController.addStudents).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on add students', async () => {
      const response = await supertest(app)
        .post('/lesson/student/add')
        .send({ id: 'invalid-id', newStudentsList: [] });

      expect(response.statusCode).toBe(422);
      expect(lessonController.addStudents).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on remove students', async () => {
      const response = await supertest(app)
        .post('/lesson/student/remove')
        .send({ id: 'invalid-id', studentsListToRemove: [] });

      expect(response.statusCode).toBe(422);
      expect(lessonController.removeStudents).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid add-day payload', async () => {
      const response = await supertest(app).post('/lesson/day/add').send({});

      expect(response.statusCode).toBe(400);
      expect(lessonController.addDay).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on add day', async () => {
      const response = await supertest(app)
        .post('/lesson/day/add')
        .send({ id: 'invalid-id', newDaysList: [] });

      expect(response.statusCode).toBe(422);
      expect(lessonController.addDay).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid add-time payload', async () => {
      const response = await supertest(app).post('/lesson/time/add').send({});

      expect(response.statusCode).toBe(400);
      expect(lessonController.addTime).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on add time', async () => {
      const response = await supertest(app)
        .post('/lesson/time/add')
        .send({ id: 'invalid-id', newTimesList: [] });

      expect(response.statusCode).toBe(422);
      expect(lessonController.addTime).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on remove day', async () => {
      const response = await supertest(app)
        .post('/lesson/day/remove')
        .send({ id: 'invalid-id', daysListToRemove: [] });

      expect(response.statusCode).toBe(422);
      expect(lessonController.removeDay).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on remove time', async () => {
      const response = await supertest(app)
        .post('/lesson/time/remove')
        .send({ id: 'invalid-id', timesListToRemove: [] });

      expect(response.statusCode).toBe(422);
      expect(lessonController.removeTime).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
