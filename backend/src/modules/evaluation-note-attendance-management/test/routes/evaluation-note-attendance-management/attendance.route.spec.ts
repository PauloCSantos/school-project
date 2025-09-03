import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import AttendanceController from '@/modules/evaluation-note-attendance-management/interface/controller/attendance.controller';
import AttendanceRoute from '@/modules/evaluation-note-attendance-management/interface/route/attendance.route';

describe('AttendanceRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let attendanceController: jest.Mocked<AttendanceController>;
  let middleware: AuthUserMiddleware;

  const baseAttendance = {
    date: new Date('2025-05-26'),
    lesson: 'Aula 1',
    hour: '10:00',
    day: 'Mon',
    studentsPresent: [new Id().value],
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    attendanceController = {
      findAll: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addStudents: jest.fn(),
      removeStudents: jest.fn(),
    } as unknown as jest.Mocked<AttendanceController>;

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

    new AttendanceRoute(attendanceController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all attendances with pagination', async () => {
      attendanceController.findAll.mockResolvedValue([
        { id: new Id().value, ...baseAttendance },
        { id: new Id().value, ...baseAttendance, lesson: 'Aula 2' },
      ]);

      const response = await supertest(app).get('/attendances?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(attendanceController.findAll).toHaveBeenCalledWith(
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

    it('should create a new attendance', async () => {
      const createdId = new Id().value;
      attendanceController.create.mockResolvedValue({ id: createdId });

      const response = await supertest(app).post('/attendance').send(baseAttendance);

      expect(response.statusCode).toBe(201);
      expect(attendanceController.create).toHaveBeenCalledWith(
        { ...baseAttendance, date: baseAttendance.date.toISOString() },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find attendance by id', async () => {
      const id = new Id().value;
      attendanceController.find.mockResolvedValue({ id, ...baseAttendance });

      const response = await supertest(app).get(`/attendance/${id}`);

      expect(response.statusCode).toBe(200);
      expect(attendanceController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        id,
        ...baseAttendance,
        date: baseAttendance.date.toISOString(),
      });
    });

    it('should update an attendance', async () => {
      const id = new Id().value;
      const payload = { id, lesson: 'Aula 2' };
      attendanceController.update.mockResolvedValue({
        ...baseAttendance,
        ...payload,
        id,
      });

      const response = await supertest(app).patch('/attendance').send(payload);

      expect(response.statusCode).toBe(200);
      expect(attendanceController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        ...baseAttendance,
        ...payload,
        id,
        date: baseAttendance.date.toISOString(),
      });
    });

    it('should delete an attendance by ID', async () => {
      const id = new Id().value;
      attendanceController.delete.mockResolvedValue({
        message: 'Operation completed successfully',
      });

      const response = await supertest(app).delete(`/attendance/${id}`);

      expect(response.statusCode).toBe(200);
      expect(attendanceController.delete).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: 'Operation completed successfully' });
    });

    it('should add students to an attendance record', async () => {
      const id = new Id().value;
      const newStudentsList = [new Id().value, new Id().value];
      attendanceController.addStudents.mockResolvedValue({
        message: 'Operation completed successfully',
      });

      const response = await supertest(app)
        .post('/attendance/add/students')
        .send({ id, newStudentsList });

      expect(response.statusCode).toBe(200);
      expect(attendanceController.addStudents).toHaveBeenCalledWith(
        { id, newStudentsList },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: 'Operation completed successfully' });
    });

    it('should remove students from an attendance record', async () => {
      const id = new Id().value;
      const studentsListToRemove = [new Id().value, new Id().value];
      attendanceController.removeStudents.mockResolvedValue({
        message: 'Operation completed successfully',
      });

      const response = await supertest(app)
        .post('/attendance/remove/students')
        .send({ id, studentsListToRemove });

      expect(response.statusCode).toBe(200);
      expect(attendanceController.removeStudents).toHaveBeenCalledWith(
        { id, studentsListToRemove },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: 'Operation completed successfully' });
    });
  });

  describe('failure', () => {
    it('should return 422 for invalid quantity or offset', async () => {
      const response = await supertest(app).get('/attendances?offset=a');

      expect(response.statusCode).toBe(422);
      expect(attendanceController.findAll).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on find', async () => {
      const response = await supertest(app).get('/attendance/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(attendanceController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when attendance is not found', async () => {
      const id = new Id().value;
      attendanceController.find.mockResolvedValue(null as any);

      const response = await supertest(app).get(`/attendance/${id}`);

      expect(response.statusCode).toBe(404);
      expect(attendanceController.find).toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid data on create', async () => {
      const response = await supertest(app).post('/attendance').send({});

      expect(response.statusCode).toBe(400);
      expect(attendanceController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for missing id on update', async () => {
      const response = await supertest(app)
        .patch('/attendance')
        .send({ lesson: 'Aula 2' });

      expect(response.statusCode).toBe(400);
      expect(attendanceController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/attendance')
        .send({ id: 'invalid-id', lesson: 'Aula 2' });

      expect(response.statusCode).toBe(422);
      expect(attendanceController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/attendance/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(attendanceController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid add-students payload', async () => {
      const response = await supertest(app).post('/attendance/add/students').send({});

      expect(response.statusCode).toBe(400);
      expect(attendanceController.addStudents).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid remove-students payload', async () => {
      const response = await supertest(app).post('/attendance/remove/students').send({});

      expect(response.statusCode).toBe(400);
      expect(attendanceController.removeStudents).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
