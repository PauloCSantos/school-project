import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { LessonController } from '../../interface/controller/lesson.controller';
import { LessonRoute } from '../../interface/route/lesson.route';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      //@ts-expect-error
      handle: jest.fn((req: any, res: any, next: any) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockLessonController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().value }),
    find: jest.fn().mockResolvedValue({
      name: 'Math advanced I',
      duration: 60,
      teacher: new Id().value,
      studentsList: [new Id().value, new Id().value, new Id().value],
      subject: new Id().value,
      days: ['mon', 'fri'] as DayOfWeek[],
      times: ['15:55', '19:00'] as Hour[],
      semester: 2 as 1 | 2,
    }),
    findAll: jest.fn().mockResolvedValue([
      {
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
    update: jest.fn().mockResolvedValue({
      name: 'Math advanced I',
      duration: 60,
      teacher: new Id().value,
      subject: new Id().value,
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
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const lessonRoute = new LessonRoute(
    lessonController,
    expressHttp,
    authUserMiddleware
  );
  lessonRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /lesson', () => {
    it('should create a lesson', async () => {
      const response = await supertest(app)
        .post('/lesson')
        .send({
          name: 'Math advanced I',
          duration: 60,
          teacher: new Id().value,
          studentsList: [new Id().value, new Id().value, new Id().value],
          subject: new Id().value,
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
      const response = await supertest(app).get(`/lesson/${new Id().value}`);
      expect(response.status).toBe(200);
      expect(lessonController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /lessons/', () => {
    it('should find all lessons', async () => {
      const response = await supertest(app).get('/lessons');
      expect(response.status).toBe(200);
      expect(lessonController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /lesson/:id', () => {
    it('should update a lesson by ID', async () => {
      const response = await supertest(app)
        .patch(`/lesson/${new Id().value}`)
        .send({
          duration: 50,
        });
      expect(response.status).toBe(200);
      expect(lessonController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /lesson/:id', () => {
    it('should delete a lesson by ID', async () => {
      const response = await supertest(app).delete(`/lesson/${new Id().value}`);
      expect(response.status).toBe(200);
      expect(lessonController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
  describe('POST /lesson/add/students', () => {
    it('should add students to the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/add/students')
        .send({
          id: new Id().value,
          newStudentsList: [new Id().value],
        });
      expect(response.status).toBe(201);
      expect(lessonController.addStudents).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('POST /lesson/remove/students', () => {
    it('should remove students from the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/remove/students')
        .send({
          id: new Id().value,
          studentsListToRemove: [new Id().value, new Id().value],
        });
      expect(response.status).toBe(201);
      expect(lessonController.removeStudents).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('POST /lesson/add/day', () => {
    it('should add day to the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/add/day')
        .send({
          id: new Id().value,
          newDaysList: ['sun'],
        });
      expect(response.status).toBe(201);
      expect(lessonController.addDay).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('POST /lesson/remove/day', () => {
    it('should remove students from the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/remove/day')
        .send({
          id: new Id().value,
          daysListToRemove: ['mon', 'fri'],
        });
      expect(response.status).toBe(201);
      expect(lessonController.removeDay).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('POST /lesson/add/time', () => {
    it('should add time to the lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/add/time')
        .send({
          id: new Id().value,
          newTimesList: ['22:00'],
        });
      expect(response.status).toBe(201);
      expect(lessonController.addTime).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('POST /lesson/remove/time', () => {
    it('should remove time from the Lesson', async () => {
      const response = await supertest(app)
        .post('/lesson/remove/time')
        .send({
          id: new Id().value,
          timesListToRemove: ['13:00', '19:00'],
        });
      expect(response.status).toBe(201);
      expect(lessonController.removeTime).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
});
