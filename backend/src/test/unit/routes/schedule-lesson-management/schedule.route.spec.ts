import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { ScheduleController } from '@/interface/controller/schedule-lesson-management/schedule.controller';
import { ScheduleRoute } from '@/interface/route/schedule-lesson-management/schedule.route';

const mockScheduleController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().id }),
    find: jest.fn().mockResolvedValue({
      student: new Id().id,
      curriculum: new Id().id,
      lessonsList: [new Id().id, new Id().id, new Id().id],
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        student: new Id().id,
        curriculum: new Id().id,
        lessonsList: [new Id().id, new Id().id, new Id().id],
      },
      {
        student: new Id().id,
        curriculum: new Id().id,
        lessonsList: [new Id().id, new Id().id, new Id().id],
      },
    ]),
    update: jest.fn().mockResolvedValue({
      student: new Id().id,
      curriculum: new Id().id,
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
  const expressHttp = new ExpressHttp();
  const scheduleRoute = new ScheduleRoute(scheduleController, expressHttp);
  scheduleRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /schedule', () => {
    it('should create a Schedule', async () => {
      const response = await supertest(app)
        .post('/schedule')
        .send({
          student: new Id().id,
          curriculum: new Id().id,
          lessonsList: [new Id().id, new Id().id, new Id().id],
        });
      expect(response.status).toBe(201);
      expect(scheduleController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /schedule/:id', () => {
    it('should find a schedule by ID', async () => {
      const response = await supertest(app).get('/schedule/123');
      expect(response.status).toBe(200);
      expect(scheduleController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /schedule/', () => {
    it('should find all schedules', async () => {
      const response = await supertest(app).get('/schedule');
      expect(response.status).toBe(200);
      expect(scheduleController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined;
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /schedule/:id', () => {
    it('should update a schedule by ID', async () => {
      const response = await supertest(app).patch('/schedule/123').send({
        curriculum: new Id().id,
      });
      expect(response.status).toBe(200);
      expect(scheduleController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /schedule/:id', () => {
    it('should delete a schedule by ID', async () => {
      const response = await supertest(app).delete('/schedule/123');
      expect(response.status).toBe(200);
      expect(scheduleController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined;
    });
  });
  describe('POST /schedule/add', () => {
    it('should add lessons to the schedule', async () => {
      const response = await supertest(app)
        .post('/schedule/add')
        .send({
          id: new Id().id,
          newLessonsList: [new Id().id],
        });
      expect(response.status).toBe(201);
      expect(scheduleController.addLessons).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
  describe('POST /schedule/remove', () => {
    it('should remove lessons from the schedule', async () => {
      const response = await supertest(app)
        .post('/schedule/remove')
        .send({
          id: new Id().id,
          lessonsListToRemove: [new Id().id, new Id().id],
        });
      expect(response.status).toBe(201);
      expect(scheduleController.removeLessons).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
});
