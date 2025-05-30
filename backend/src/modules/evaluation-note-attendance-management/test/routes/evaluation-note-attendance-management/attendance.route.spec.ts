import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import AttendanceController from '@/modules/evaluation-note-attendance-management/interface/controller/attendance.controller';
import { AttendanceRoute } from '@/modules/evaluation-note-attendance-management/interface/route/attendance.route';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      handle: jest.fn((_req, _res, next) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockAttendanceController = jest.fn(
  () =>
    ({
      create: jest.fn().mockResolvedValue({
        id: new Id().value,
      }),
      find: jest.fn().mockResolvedValue({
        date: new Date(),
        day: 'fri' as DayOfWeek,
        hour: '06:50' as Hour,
        lesson: new Id().value,
        studentsPresent: [new Id().value, new Id().value, new Id().value],
      }),
      findAll: jest.fn().mockResolvedValue([
        {
          date: new Date(),
          day: 'fri' as DayOfWeek,
          hour: '06:50' as Hour,
          lesson: new Id().value,
          studentsPresent: [new Id().value, new Id().value, new Id().value],
        },
        {
          date: new Date(),
          day: 'fri' as DayOfWeek,
          hour: '06:50' as Hour,
          lesson: new Id().value,
          studentsPresent: [new Id().value, new Id().value, new Id().value],
        },
      ]),
      update: jest.fn().mockResolvedValue({
        date: new Date(),
        day: 'fri' as DayOfWeek,
        hour: '06:50' as Hour,
        lesson: new Id().value,
      }),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
      addStudents: jest.fn().mockResolvedValue('1 value was entered'),
      removeStudents: jest.fn().mockResolvedValue('2 values were removed'),
    }) as unknown as AttendanceController
);

describe('AttendanceRoute integration tests', () => {
  const attendanceController = mockAttendanceController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const attendanceRoute = new AttendanceRoute(
    attendanceController,
    expressHttp,
    authUserMiddleware
  );
  attendanceRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /attendance', () => {
    it('should create a new attendance record', async () => {
      const response = await supertest(app)
        .post('/attendance')
        .send({
          date: new Date('02/10/26'),
          day: 'fri' as DayOfWeek,
          hour: '06:50' as Hour,
          lesson: new Id().value,
          studentsPresent: [new Id().value, new Id().value, new Id().value],
        });

      expect(response.status).toBe(201);
      expect(attendanceController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });

  describe('GET /attendance/:id', () => {
    it('should find an attendance record by ID', async () => {
      const response = await supertest(app).get(
        `/attendance/${new Id().value}`
      );

      expect(response.status).toBe(200);
      expect(attendanceController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.lesson).toBeDefined();
      expect(response.body.studentsPresent).toBeDefined();
    });
  });

  describe('GET /attendances', () => {
    it('should find all attendance records', async () => {
      const response = await supertest(app).get('/attendances');

      expect(response.status).toBe(200);
      expect(attendanceController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
  });

  describe('PATCH /attendance/:id', () => {
    it('should update an attendance record by ID', async () => {
      const response = await supertest(app)
        .patch(`/attendance/${new Id().value}`)
        .send({
          date: new Date(),
        });

      expect(response.status).toBe(200);
      expect(attendanceController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.date).toBeDefined();
    });
  });

  describe('DELETE /attendance/:id', () => {
    it('should delete an attendance record by ID', async () => {
      const response = await supertest(app).delete(
        `/attendance/${new Id().value}`
      );

      expect(response.status).toBe(200);
      expect(attendanceController.delete).toHaveBeenCalled();
      expect(response.body.message).toBe('Operação concluída com sucesso');
    });
  });

  describe('POST /attendance/add/students', () => {
    it('should add students to an attendance record', async () => {
      const response = await supertest(app)
        .post('/attendance/add/students')
        .send({
          id: new Id().value,
          newStudentsList: [new Id().value],
        });

      expect(response.status).toBe(201);
      expect(attendanceController.addStudents).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });

  describe('POST /attendance/remove/students', () => {
    it('should remove students from an attendance record', async () => {
      const response = await supertest(app)
        .post('/attendance/remove/students')
        .send({
          id: new Id().value,
          studentsListToRemove: [new Id().value, new Id().value],
        });

      expect(response.status).toBe(201);
      expect(attendanceController.removeStudents).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
});
