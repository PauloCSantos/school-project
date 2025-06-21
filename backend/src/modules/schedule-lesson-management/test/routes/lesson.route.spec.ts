import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { LessonController } from '../../interface/controller/lesson.controller';
import LessonRoute from '../../interface/route/lesson.route';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';

describe('LessonRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let lessonController: LessonController;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    lessonController = {
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          id,
          name: 'Math advanced I',
          duration: 60,
          teacher: new Id().value,
          studentsList: [new Id().value, new Id().value, new Id().value],
          subject: new Id().value,
          days: ['mon', 'fri'] as DayOfWeek[],
          times: ['15:55', '19:00'] as Hour[],
          semester: 2 as 1 | 2,
        })
      ),
      findAll: jest.fn().mockResolvedValue([
        {
          id: new Id().value,
          name: 'Math advanced I',
          duration: 60,
          teacher: new Id().value,
          studentsList: [new Id().value, new Id().value, new Id().value],
          subject: new Id().value,
          days: ['mon', 'fri'] as DayOfWeek[],
          times: ['15:55', '19:00'] as Hour[],
          semester: 2 as 1 | 2,
        },
        {
          id: new Id().value,
          name: 'Math advanced II',
          duration: 60,
          teacher: new Id().value,
          studentsList: [new Id().value, new Id().value, new Id().value],
          subject: new Id().value,
          days: ['mon', 'fri'] as DayOfWeek[],
          times: ['15:55', '19:00'] as Hour[],
          semester: 2 as 1 | 2,
        },
      ]),
      update: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          id,
          name: 'Math advanced I',
          duration: 60,
          teacher: new Id().value,
          subject: new Id().value,
          semester: 2 as 1 | 2,
        })
      ),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
      addStudents: jest.fn().mockResolvedValue('1 value was entered'),
      removeStudents: jest.fn().mockResolvedValue('2 values were removed'),
      addDay: jest.fn().mockResolvedValue('1 value was entered'),
      removeDay: jest.fn().mockResolvedValue('2 values were removed'),
      addTime: jest.fn().mockResolvedValue('1 value was entered'),
      removeTime: jest.fn().mockResolvedValue('2 values were removed'),
    } as unknown as LessonController;

    middleware = {
      handle: jest.fn((_req, next) => next()),
    } as unknown as AuthUserMiddleware;

    new LessonRoute(lessonController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all lessons', async () => {
      const response = await supertest(app).get('/lessons');

      expect(response.statusCode).toBe(200);
      expect(lessonController.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create a lesson', async () => {
      const payload = {
        name: 'Math advanced I',
        duration: 60,
        teacher: new Id().value,
        studentsList: [new Id().value, new Id().value, new Id().value],
        subject: new Id().value,
        days: ['mon', 'fri'] as DayOfWeek[],
        times: ['15:55', '19:00'] as Hour[],
        semester: 2 as 1 | 2,
      };
      const response = await supertest(app).post('/lesson').send(payload);

      expect(response.statusCode).toBe(201);
      expect(lessonController.create).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find a lesson by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/lesson/${id}`);

      expect(response.statusCode).toBe(200);
      expect(lessonController.find).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should update a lesson by ID', async () => {
      const id = new Id().value;
      const payload = { id, duration: 50 };
      const response = await supertest(app).patch(`/lesson`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.update).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should delete a lesson by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/lesson/${id}`);

      expect(response.statusCode).toBe(200);
      expect(lessonController.delete).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });

    it('should add students to the lesson', async () => {
      const id = new Id().value;
      const payload = {
        id: id,
        newStudentsList: [new Id().value],
      };
      const response = await supertest(app)
        .post(`/lesson/student/add`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.addStudents).toHaveBeenCalledWith(payload);
      expect(response.body).toBeDefined();
    });

    it('should remove students from the lesson', async () => {
      const id = new Id().value;
      const payload = {
        id: id,
        studentsListToRemove: [new Id().value, new Id().value],
      };
      const response = await supertest(app)
        .post(`/lesson/student/remove`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.removeStudents).toHaveBeenCalledWith(payload);
      expect(response.body).toBeDefined();
    });

    it('should add day to the lesson', async () => {
      const id = new Id().value;
      const payload = {
        id: id,
        newDaysList: ['sun'],
      };
      const response = await supertest(app)
        .post(`/lesson/day/add`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.addDay).toHaveBeenCalledWith(payload);
      expect(response.body).toBeDefined();
    });

    it('should remove days from the lesson', async () => {
      const id = new Id().value;
      const payload = {
        id: id,
        daysListToRemove: ['mon', 'fri'],
      };
      const response = await supertest(app)
        .post(`/lesson/day/remove`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.removeDay).toHaveBeenCalledWith(payload);
      expect(response.body).toBeDefined();
    });

    it('should add time to the lesson', async () => {
      const id = new Id().value;
      const payload = {
        id: id,
        newTimesList: ['22:00'],
      };
      const response = await supertest(app)
        .post(`/lesson/time/add`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.addTime).toHaveBeenCalledWith(payload);
      expect(response.body).toBeDefined();
    });

    it('should remove time from the lesson', async () => {
      const id = new Id().value;
      const payload = {
        id: id,
        timesListToRemove: ['13:00', '19:00'],
      };
      const response = await supertest(app)
        .post(`/lesson/time/remove`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(lessonController.removeTime).toHaveBeenCalledWith(payload);
      expect(response.body).toBeDefined();
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/lesson/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/lesson').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/lesson/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/lesson').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: expect.any(String),
      });
    });

    it('should return 400 for invalid id on add students', async () => {
      const id = 'invalid-id';
      const response = await supertest(app)
        .post(`/lesson/student/add`)
        .send({ id, newStudentsList: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on remove students', async () => {
      const response = await supertest(app)
        .post(`/lesson/student/remove`)
        .send({ id: 'invalid-id', studentsListToRemove: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on add day', async () => {
      const id = 'invalid-id';
      const response = await supertest(app)
        .post(`/lesson/day/add`)
        .send({ id, newDaysList: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on remove day', async () => {
      const id = 123;
      const response = await supertest(app)
        .post(`/lesson/day/remove`)
        .send({ id, daysListToRemove: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on add time', async () => {
      const id = 'invalid-id';
      const response = await supertest(app)
        .post(`/lesson/time/add`)
        .send({ id, newTimesList: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on remove time', async () => {
      const response = await supertest(app)
        .post(`/lesson/time/remove`)
        .send({ id: 'invalid-id', timesListToRemove: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });
  });
});
