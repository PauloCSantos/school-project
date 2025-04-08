import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ScheduleController } from '../../interface/controller/schedule.controller';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import { ScheduleRoute } from '../../interface/route/schedule.route';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      //@ts-expect-error
      handle: jest.fn((req: any, res: any, next: any) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockScheduleController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().value }),
    find: jest.fn().mockResolvedValue({
      student: new Id().value,
      curriculum: new Id().value,
      lessonsList: [new Id().value, new Id().value, new Id().value],
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        student: new Id().value,
        curriculum: new Id().value,
        lessonsList: [new Id().value, new Id().value, new Id().value],
      },
      {
        student: new Id().value,
        curriculum: new Id().value,
        lessonsList: [new Id().value, new Id().value, new Id().value],
      },
    ]),
    update: jest.fn().mockResolvedValue({
      student: new Id().value,
      curriculum: new Id().value,
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
    addLessons: jest.fn().mockResolvedValue('1 value was entered'),
    removeLessons: jest.fn().mockResolvedValue('2 values were removed'),
  } as unknown as ScheduleController;
});

describe('scheduleRoute unit test', () => {
  const scheduleController = mockScheduleController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const scheduleRoute = new ScheduleRoute(
    scheduleController,
    expressHttp,
    authUserMiddleware
  );
  scheduleRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /schedule', () => {
    it('should create a Schedule', async () => {
      const response = await supertest(app)
        .post('/schedule')
        .send({
          student: new Id().value,
          curriculum: new Id().value,
          lessonsList: [new Id().value, new Id().value, new Id().value],
        });
      expect(response.status).toBe(201);
      expect(scheduleController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /schedule/:id', () => {
    it('should find a schedule by ID', async () => {
      const response = await supertest(app).get(`/schedule/${new Id().value}`);
      expect(response.status).toBe(200);
      expect(scheduleController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /schedules/', () => {
    it('should find all schedules', async () => {
      const response = await supertest(app).get('/schedules');
      expect(response.status).toBe(200);
      expect(scheduleController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /schedule/:id', () => {
    it('should update a schedule by ID', async () => {
      const response = await supertest(app)
        .patch(`/schedule/${new Id().value}`)
        .send({
          curriculum: new Id().value,
        });
      expect(response.status).toBe(200);
      expect(scheduleController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /schedule/:id', () => {
    it('should delete a schedule by ID', async () => {
      const response = await supertest(app).delete(
        `/schedule/${new Id().value}`
      );
      expect(response.status).toBe(200);
      expect(scheduleController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
  describe('POST /schedule/add', () => {
    it('should add lessons to the schedule', async () => {
      const response = await supertest(app)
        .post('/schedule/add')
        .send({
          id: new Id().value,
          newLessonsList: [new Id().value],
        });
      expect(response.status).toBe(201);
      expect(scheduleController.addLessons).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('POST /schedule/remove', () => {
    it('should remove lessons from the schedule', async () => {
      const response = await supertest(app)
        .post('/schedule/remove')
        .send({
          id: new Id().value,
          lessonsListToRemove: [new Id().value, new Id().value],
        });
      expect(response.status).toBe(201);
      expect(scheduleController.removeLessons).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
});
