import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { LessonController } from '@/interface/controller/schedule-lesson-management/lesson.controller';
import { LessonRoute } from '@/interface/route/schedule-lesson-management/lesson.route';

const mockLessonController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().id }),
    find: jest.fn().mockResolvedValue({
      name: 'Math advanced I',
      duration: 60,
      teacher: new Id().id,
      studentsList: [new Id().id, new Id().id, new Id().id],
      subject: new Id().id,
      days: ['mon', 'fri'] as DayOfWeek[],
      times: ['15:55', '19:00'] as Hour[],
      semester: 2 as 1 | 2,
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        name: 'Math advanced I',
        duration: 60,
        teacher: new Id().id,
        studentsList: [new Id().id, new Id().id, new Id().id],
        subject: new Id().id,
        days: ['mon', 'fri'] as DayOfWeek[],
        times: ['15:55', '19:00'] as Hour[],
        semester: 2 as 1 | 2,
      },
      {
        name: 'Math advanced II',
        duration: 60,
        teacher: new Id().id,
        studentsList: [new Id().id, new Id().id, new Id().id],
        subject: new Id().id,
        days: ['mon', 'fri'] as DayOfWeek[],
        times: ['15:55', '19:00'] as Hour[],
        semester: 2 as 1 | 2,
      },
    ]),
    update: jest.fn().mockResolvedValue({
      name: 'Math advanced I',
      duration: 60,
      teacher: new Id().id,
      subject: new Id().id,
      semester: 2 as 1 | 2,
    }),
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
});

describe('LessonRoute unit test', () => {
  const lessonController = mockLessonController();
  const expressHttp = new ExpressHttp();
  const lessonRoute = new LessonRoute(lessonController, expressHttp);
  lessonRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /lesson', () => {
    it('should create a lesson', async () => {
      const response = await supertest(app)
        .post('/lesson')
        .send({
          name: 'Math advanced I',
          duration: 60,
          teacher: new Id().id,
          studentsList: [new Id().id, new Id().id, new Id().id],
          subject: new Id().id,
          days: ['mon', 'fri'] as DayOfWeek[],
          times: ['15:55', '19:00'] as Hour[],
          semester: 2 as 1 | 2,
        });
      expect(response.status).toBe(201);
      expect(lessonController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /lesson/:id', () => {
    it('should find a lesson by ID', async () => {
      const response = await supertest(app).get('/lesson/123');
      expect(response.status).toBe(200);
      expect(lessonController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /lesson/', () => {
    it('should find all lessons', async () => {
      const response = await supertest(app).get('/lesson');
      expect(response.status).toBe(200);
      expect(lessonController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined;
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /lesson/:id', () => {
    it('should update a lesson by ID', async () => {
      const response = await supertest(app).patch('/lesson/123').send({
        duration: 50,
      });
      expect(response.status).toBe(200);
      expect(lessonController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /lesson/:id', () => {
    it('should delete a lesson by ID', async () => {
      const response = await supertest(app).delete('/lesson/123');
      expect(response.status).toBe(204);
      expect(lessonController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined;
    });
  });
  describe('POST /lesson/add/students', () => {
    it('should add students to the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/add/students')
        .send({
          id: new Id().id,
          newStudentsList: [new Id().id],
        });
      expect(response.status).toBe(201);
      expect(lessonController.addStudents).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
  describe('POST /lesson/remove/students', () => {
    it('should remove students from the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/remove/students')
        .send({
          id: new Id().id,
          studentsListToRemove: [new Id().id, new Id().id],
        });
      expect(response.status).toBe(201);
      expect(lessonController.removeStudents).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
  describe('POST /lesson/add/day', () => {
    it('should add day to the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/add/day')
        .send({
          id: new Id().id,
          newDayList: ['sun'],
        });
      expect(response.status).toBe(201);
      expect(lessonController.addDay).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
  describe('POST /lesson/remove/day', () => {
    it('should remove students from the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/remove/day')
        .send({
          id: new Id().id,
          dayListToRemove: ['mon', 'fri'],
        });
      expect(response.status).toBe(201);
      expect(lessonController.removeDay).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
  describe('POST /lesson/add/time', () => {
    it('should add time to the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/add/time')
        .send({
          id: new Id().id,
          newTimeList: ['22:00'],
        });
      expect(response.status).toBe(201);
      expect(lessonController.addTime).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
  describe('POST /lesson/remove/time', () => {
    it('should remove time from the Lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/remove/time')
        .send({
          id: new Id().id,
          timeListToRemove: ['13:00', '19:00'],
        });
      expect(response.status).toBe(201);
      expect(lessonController.removeTime).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
});
