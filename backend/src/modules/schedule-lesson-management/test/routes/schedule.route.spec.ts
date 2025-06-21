import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ScheduleController } from '../../interface/controller/schedule.controller';
import ScheduleRoute from '../../interface/route/schedule.route';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';

describe('ScheduleRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let scheduleController: ScheduleController;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    scheduleController = {
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          id,
          student: new Id().value,
          curriculum: new Id().value,
          lessonsList: [new Id().value, new Id().value, new Id().value],
        })
      ),
      findAll: jest.fn().mockResolvedValue([
        {
          id: new Id().value,
          student: new Id().value,
          curriculum: new Id().value,
          lessonsList: [new Id().value, new Id().value, new Id().value],
        },
        {
          id: new Id().value,
          student: new Id().value,
          curriculum: new Id().value,
          lessonsList: [new Id().value, new Id().value, new Id().value],
        },
      ]),
      update: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          id,
          student: new Id().value,
          curriculum: new Id().value,
          lessonsList: [new Id().value, new Id().value],
        })
      ),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
      addLessons: jest.fn().mockResolvedValue('1 value was entered'),
      removeLessons: jest.fn().mockResolvedValue('2 values were removed'),
    } as unknown as ScheduleController;

    middleware = {
      handle: jest.fn((_req, next) => next()),
    } as unknown as AuthUserMiddleware;

    new ScheduleRoute(scheduleController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all schedules', async () => {
      const response = await supertest(app).get('/schedules');

      expect(response.statusCode).toBe(200);
      expect(scheduleController.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create a schedule', async () => {
      const payload = {
        student: new Id().value,
        curriculum: new Id().value,
        lessonsList: [new Id().value, new Id().value, new Id().value],
      };
      const response = await supertest(app).post('/schedule').send(payload);

      expect(response.statusCode).toBe(201);
      expect(scheduleController.create).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find a schedule by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/schedule/${id}`);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.find).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should update a schedule by ID', async () => {
      const id = new Id().value;
      const payload = { id, curriculum: new Id().value };
      const response = await supertest(app).patch(`/schedule`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.update).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should delete a schedule by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/schedule/${id}`);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.delete).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });

    it('should add lessons to the schedule', async () => {
      const id = new Id().value;
      const payload = {
        id,
        newLessonsList: [new Id().value],
      };
      const response = await supertest(app)
        .post(`/schedule/lesson/add`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.addLessons).toHaveBeenCalledWith({
        ...payload,
        id,
      });
      expect(response.body).toBeDefined();
    });

    it('should remove lessons from the schedule', async () => {
      const id = new Id().value;
      const payload = {
        id,
        lessonsListToRemove: [new Id().value, new Id().value],
      };
      const response = await supertest(app)
        .post(`/schedule/lesson/remove`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.removeLessons).toHaveBeenCalledWith({
        ...payload,
        id,
      });
      expect(response.body).toBeDefined();
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/schedule/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/schedule').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/schedule/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/schedule').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: expect.any(String),
      });
    });

    it('should return 400 for invalid id on add lessons', async () => {
      const id = `invalid-id`;
      const response = await supertest(app)
        .post(`/schedule/lesson/add`)
        .send({ id, newLessonsList: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on remove lessons', async () => {
      const id = `invalid-id`;
      const response = await supertest(app)
        .post(`/schedule/lesson/remove`)
        .send({ id, lessonsListToRemove: [] });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for missing payload on add lessons', async () => {
      const response = await supertest(app).post(`/schedule/lesson/add`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for missing payload on remove lessons', async () => {
      const id = new Id().value;
      const response = await supertest(app)
        .post(`/schedule/lesson/remove`)
        .send({ id });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });
  });
});
