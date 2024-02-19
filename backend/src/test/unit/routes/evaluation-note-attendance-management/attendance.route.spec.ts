import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { AttendanceController } from '@/interface/controller/evaluation-note-attendance-management/attendance.controller';
import { AttendanceRoute } from '@/interface/route/evaluation-note-attendance-management/attendance.route';

const mockAttendanceController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().id }),
    find: jest.fn().mockResolvedValue({
      date: new Date(),
      day: 'fri' as DayOfWeek,
      hour: '06:50' as Hour,
      lesson: new Id().id,
      studentsPresent: [new Id().id, new Id().id, new Id().id],
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        date: new Date(),
        day: 'fri' as DayOfWeek,
        hour: '06:50' as Hour,
        lesson: new Id().id,
        studentsPresent: [new Id().id, new Id().id, new Id().id],
      },
      {
        date: new Date(),
        day: 'fri' as DayOfWeek,
        hour: '06:50' as Hour,
        lesson: new Id().id,
        studentsPresent: [new Id().id, new Id().id, new Id().id],
      },
    ]),
    update: jest.fn().mockResolvedValue({
      date: new Date(),
      day: 'fri' as DayOfWeek,
      hour: '06:50' as Hour,
      lesson: new Id().id,
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
    addStudents: jest.fn().mockResolvedValue('1 value was entered'),
    removeStudents: jest.fn().mockResolvedValue('2 values were removed'),
  } as unknown as AttendanceController;
});

describe('AttendanceRoute unit test', () => {
  const attendanceController = mockAttendanceController();
  const expressHttp = new ExpressHttp();
  const attendanceRoute = new AttendanceRoute(
    attendanceController,
    expressHttp
  );
  attendanceRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /attendance', () => {
    it('should create a attendance', async () => {
      const response = await supertest(app)
        .post('/attendance')
        .send({
          date: new Date('02/10/26'),
          day: 'fri' as DayOfWeek,
          hour: '06:50' as Hour,
          lesson: new Id().id,
          studentsPresent: [new Id().id, new Id().id, new Id().id],
        });
      expect(response.status).toBe(201);
      expect(attendanceController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /attendance/:id', () => {
    it('should find a attendance by ID', async () => {
      const response = await supertest(app).get('/attendance/123');
      expect(response.status).toBe(200);
      expect(attendanceController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /attendance/', () => {
    it('should find all attendances', async () => {
      const response = await supertest(app).get('/attendance');
      expect(response.status).toBe(200);
      expect(attendanceController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined;
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /attendance/:id', () => {
    it('should update a attendance by ID', async () => {
      const response = await supertest(app).patch('/attendance/123').send({
        date: new Date(),
      });
      expect(response.status).toBe(200);
      expect(attendanceController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /attendance/:id', () => {
    it('should delete a attendance by ID', async () => {
      const response = await supertest(app).delete('/attendance/123');
      expect(response.status).toBe(200);
      expect(attendanceController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined;
    });
  });
  describe('POST /attendance/add/students', () => {
    it('should add students to the attendance', async () => {
      const response = await supertest(app)
        .post('/attendance/add/students')
        .send({
          id: new Id().id,
          newStudentsList: [new Id().id],
        });
      expect(response.status).toBe(201);
      expect(attendanceController.addStudents).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
  describe('POST /attendance/remove/students', () => {
    it('should remove students from the attendance', async () => {
      const response = await supertest(app)
        .post('/attendance/remove/students')
        .send({
          id: new Id().id,
          studentsListToRemove: [new Id().id, new Id().id],
        });
      expect(response.status).toBe(201);
      expect(attendanceController.removeStudents).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
});
