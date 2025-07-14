import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserStudentController } from '../../interface/controller/student.controller';
import { UserStudentRoute } from '../../interface/route/student.route';

describe('UserStudentRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let userStudentController: UserStudentController;
  let middleware: AuthUserMiddleware;

  const mockStudentData = {
    id: new Id().value,
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    email: 'john.doe@example.com',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      zip: '12345',
      number: 1,
      avenue: 'Main Ave',
      state: 'State A',
    },
    paymentYear: 50000,
    birthday: new Date().toISOString(),
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    userStudentController = {
      findAll: jest.fn().mockResolvedValue([mockStudentData]),
      find: jest.fn().mockResolvedValue(mockStudentData),
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      update: jest.fn().mockImplementation(data => {
        const { id, ...updateData } = data;
        return Promise.resolve({ ...mockStudentData, ...updateData });
      }),
      delete: jest
        .fn()
        .mockResolvedValue({ message: 'Operação concluída com sucesso' }),
    } as unknown as UserStudentController;

    middleware = {
      handle: jest.fn((_request, next) => {
        _request.tokenData = {
          email: 'user@example.com',
          role: 'administrator',
          masterId: 'validId',
        };
        return next();
      }),
    } as unknown as AuthUserMiddleware;

    new UserStudentRoute(userStudentController, http, middleware).routes();
  });

  describe('success', () => {
    it('should return a list of students', async () => {
      const response = await supertest(app).get('/users-student');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([mockStudentData]);
    });

    it('should return a student by ID', async () => {
      const response = await supertest(app).get(
        `/user-student/${mockStudentData.id}`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockStudentData);
    });

    it('should create a new student', async () => {
      const date = new Date().toISOString();
      const payload = {
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        address: {
          street: 'Street A',
          city: 'City A',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue A',
          state: 'State A',
        },
        paymentYear: 50000,
        birthday: date,
        email: 'teste1@test.com',
      };
      const response = await supertest(app).post('/user-student').send(payload);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should update an existing student', async () => {
      const response = await supertest(app)
        .patch(`/user-student`)
        .send({ id: mockStudentData.id, paymentYear: 51000 });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ ...mockStudentData, paymentYear: 51000 });
      expect(userStudentController.update).toHaveBeenCalledWith(
        {
          id: mockStudentData.id,
          paymentYear: 51000,
        },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
    });

    it('should delete a student by ID', async () => {
      const response = await supertest(app).delete(
        `/user-student/${mockStudentData.id}`
      );
      expect(response.statusCode).toBe(200);
      expect(userStudentController.delete).toHaveBeenCalledWith(
        {
          id: mockStudentData.id,
        },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/user-student/invalid-id');
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/user-student').send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: expect.any(String) });
    });

    it('should return 400 for invalid id or data on update', async () => {
      const response = await supertest(app).patch('/user-student').send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/user-student/invalid-id');
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });
  });
});
