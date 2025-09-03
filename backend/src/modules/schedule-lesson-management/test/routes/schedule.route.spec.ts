import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ScheduleController } from '../../interface/controller/schedule.controller';
import ScheduleRoute from '../../interface/route/schedule.route';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';

describe('ScheduleRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let scheduleController: jest.Mocked<ScheduleController>;
  let middleware: AuthUserMiddleware;

  const baseSchedule = {
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    scheduleController = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addLessons: jest.fn(),
      removeLessons: jest.fn(),
    } as unknown as jest.Mocked<ScheduleController>;

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

    new ScheduleRoute(scheduleController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all schedules with pagination', async () => {
      scheduleController.findAll.mockResolvedValue([
        { id: new Id().value, ...baseSchedule },
        { id: new Id().value, ...baseSchedule },
      ]);

      const response = await supertest(app).get('/schedules?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(scheduleController.findAll).toHaveBeenCalledWith(
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

    it('should create a schedule', async () => {
      const createdId = new Id().value;
      scheduleController.create.mockResolvedValue({ id: createdId });

      const response = await supertest(app).post('/schedule').send(baseSchedule);

      expect(response.statusCode).toBe(201);
      expect(scheduleController.create).toHaveBeenCalledWith(
        baseSchedule,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find a schedule by ID', async () => {
      const id = new Id().value;
      scheduleController.find.mockResolvedValue({ id, ...baseSchedule });

      const response = await supertest(app).get(`/schedule/${id}`);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id, ...baseSchedule });
    });

    it('should update a schedule by ID', async () => {
      const id = new Id().value;
      const payload = { id, curriculum: new Id().value };
      scheduleController.update.mockResolvedValue({ ...baseSchedule, ...payload, id });

      const response = await supertest(app).patch('/schedule').send(payload);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ ...baseSchedule, ...payload, id });
    });

    it('should delete a schedule by ID', async () => {
      const id = new Id().value;
      scheduleController.delete.mockResolvedValue({
        message: 'Operation completed successfully',
      });

      const response = await supertest(app).delete(`/schedule/${id}`);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.delete).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: 'Operation completed successfully' });
    });

    it('should add lessons to the schedule', async () => {
      const id = new Id().value;
      const payload = { id, newLessonsList: [new Id().value] };
      scheduleController.addLessons.mockResolvedValue({ message: '1 value was entered' });

      const response = await supertest(app).post('/schedule/lesson/add').send(payload);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.addLessons).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: '1 value was entered' });
    });

    it('should remove lessons from the schedule', async () => {
      const id = new Id().value;
      const payload = { id, lessonsListToRemove: [new Id().value, new Id().value] };
      scheduleController.removeLessons.mockResolvedValue({
        message: '2 values were removed',
      });

      const response = await supertest(app).post('/schedule/lesson/remove').send(payload);

      expect(response.statusCode).toBe(200);
      expect(scheduleController.removeLessons).toHaveBeenCalledWith(
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
      const response = await supertest(app).get('/schedules?offset=invalid');

      expect(response.statusCode).toBe(422);
      expect(scheduleController.findAll).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on find', async () => {
      const response = await supertest(app).get('/schedule/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(scheduleController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when schedule is not found', async () => {
      const id = new Id().value;
      scheduleController.find.mockResolvedValue(null as any);

      const response = await supertest(app).get(`/schedule/${id}`);

      expect(response.statusCode).toBe(404);
      expect(scheduleController.find).toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/schedule').send({});

      expect(response.statusCode).toBe(400);
      expect(scheduleController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for missing id on update', async () => {
      const response = await supertest(app)
        .patch('/schedule')
        .send({ curriculum: new Id().value });

      expect(response.statusCode).toBe(400);
      expect(scheduleController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/schedule')
        .send({ id: 'invalid-id', curriculum: new Id().value });

      expect(response.statusCode).toBe(422);
      expect(scheduleController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/schedule/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(scheduleController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid add-lessons payload', async () => {
      const response = await supertest(app).post('/schedule/lesson/add').send({});

      expect(response.statusCode).toBe(400);
      expect(scheduleController.addLessons).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on add lessons', async () => {
      const response = await supertest(app)
        .post('/schedule/lesson/add')
        .send({ id: 'invalid-id', newLessonsList: [] });

      expect(response.statusCode).toBe(422);
      expect(scheduleController.addLessons).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid remove-lessons payload', async () => {
      const response = await supertest(app).post('/schedule/lesson/remove').send({});

      expect(response.statusCode).toBe(400);
      expect(scheduleController.removeLessons).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on remove lessons', async () => {
      const response = await supertest(app)
        .post('/schedule/lesson/remove')
        .send({ id: 'invalid-id', lessonsListToRemove: [] });

      expect(response.statusCode).toBe(422);
      expect(scheduleController.removeLessons).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
