// attendance.route.spec.ts

import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import AttendanceController from '@/modules/evaluation-note-attendance-management/interface/controller/attendance.controller';
import AttendanceRoute from '@/modules/evaluation-note-attendance-management/interface/route/attendance.route';

describe('AttendanceRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let attendanceController: AttendanceController;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    attendanceController = {
      findAll: jest.fn().mockResolvedValue([{ id: new Id().value }]),
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) => Promise.resolve({ id })),
      update: jest.fn().mockImplementation(({ id }) => Promise.resolve({ id })),
      delete: jest
        .fn()
        .mockResolvedValue({ message: 'Operação concluída com sucesso' }),
      addStudents: jest
        .fn()
        .mockResolvedValue({ message: 'Operação concluída com sucesso' }),
      removeStudents: jest
        .fn()
        .mockResolvedValue({ message: 'Operação concluída com sucesso' }),
    } as unknown as AttendanceController;

    middleware = {
      handle: jest.fn((_req, next) => next()),
    } as unknown as AuthUserMiddleware;

    new AttendanceRoute(attendanceController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all attendances', async () => {
      const response = await supertest(app)
        .get('/attendances')
        .send({ quantity: 2, offset: 0 });

      expect(response.statusCode).toBe(200);
      expect(attendanceController.findAll).toHaveBeenCalledWith({
        quantity: 2,
        offset: 0,
      });
      expect(response.body).toEqual([{ id: expect.any(String) }]);
    });

    it('should create a new attendance', async () => {
      const payload = {
        date: '2025-05-26',
        lesson: 'Aula 1',
        studentsPresent: [new Id().value],
      };
      const response = await supertest(app).post('/attendance').send(payload);

      expect(response.statusCode).toBe(201);
      expect(attendanceController.create).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find attendance by id', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/attendance/${id}`);

      expect(response.statusCode).toBe(200);
      expect(attendanceController.find).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({ id });
    });

    it('should update an attendance', async () => {
      const id = new Id().value;
      const payload = { id: id, lesson: 'Aula 2' };
      const response = await supertest(app).patch(`/attendance`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(attendanceController.update).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id });
    });

    it('should delete an attendance by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/attendance/${id}`);

      expect(response.statusCode).toBe(200);
      expect(attendanceController.delete).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });

    it('should add students to an attendance record', async () => {
      const id = new Id().value;
      const newStudentsList = [new Id().value, new Id().value];
      const response = await supertest(app)
        .post('/attendance/add/students')
        .send({ id, newStudentsList });

      expect(response.statusCode).toBe(200);
      expect(attendanceController.addStudents).toHaveBeenCalledWith({
        id,
        newStudentsList,
      });
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });

    it('should remove students from an attendance record', async () => {
      const id = new Id().value;
      const studentsListToRemove = [new Id().value, new Id().value];
      const response = await supertest(app)
        .post('/attendance/remove/students')
        .send({ id, studentsListToRemove });

      expect(response.statusCode).toBe(200);
      expect(attendanceController.removeStudents).toHaveBeenCalledWith({
        id,
        studentsListToRemove,
      });
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid quantity or offset', async () => {
      const response = await supertest(app)
        .get('/attendances')
        .send({ offset: 'a' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/attendance/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid data on create', async () => {
      const response = await supertest(app).post('/attendance').send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id/data on update', async () => {
      const response = await supertest(app).patch('/attendance').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/attendance/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid add-students payload', async () => {
      const response = await supertest(app)
        .post('/attendance/add/students')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid remove-students payload', async () => {
      const response = await supertest(app)
        .post('/attendance/remove/students')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });
  });
});
