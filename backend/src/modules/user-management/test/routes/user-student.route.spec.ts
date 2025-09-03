import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserStudentController } from '../../interface/controller/student.controller';
import { UserStudentRoute } from '../../interface/route/student.route';

describe('UserStudentRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let userStudentController: jest.Mocked<UserStudentController>;
  let middleware: AuthUserMiddleware;

  const mockStudentData = {
    id: new Id().value,
    name: {
      fullName: 'John David Doe',
      shortName: 'John D D',
    },
    address: {
      street: 'Street A',
      city: 'City A',
      zip: '111111-111',
      number: 1,
      avenue: 'Avenue A',
      state: 'State A',
    },
    email: 'teste1@test.com',
    birthday: new Date('1995-11-12T00:00:00.000Z'),
    paymentYear: 50000,
  };

  const mockStudentData2 = {
    id: new Id().value,
    name: {
      fullName: 'Marie Jane Doe',
      shortName: 'Marie J D',
    },
    address: {
      street: 'Street B',
      city: 'City B',
      zip: '111111-111',
      number: 2,
      avenue: 'Avenue B',
      state: 'State B',
    },
    email: 'teste2@test.com',
    birthday: new Date('1995-11-12T00:00:00.000Z'),
    paymentYear: 60000,
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    userStudentController = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserStudentController>;

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

    new UserStudentRoute(userStudentController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all students', async () => {
      userStudentController.findAll.mockResolvedValue([
        mockStudentData,
        mockStudentData2,
      ]);

      const response = await supertest(app).get('/users-student?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(userStudentController.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create a student', async () => {
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
      const createdId = new Id().value;
      userStudentController.create.mockResolvedValue({ id: createdId });

      const response = await supertest(app).post('/user-student').send(payload);

      expect(response.statusCode).toBe(201);
      expect(userStudentController.create).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find a student by ID', async () => {
      const id = new Id().value;
      userStudentController.find.mockResolvedValue({
        ...mockStudentData,
        id,
      });

      const response = await supertest(app).get(`/user-student/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userStudentController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        ...mockStudentData,
        id,
        birthday: mockStudentData.birthday.toISOString(),
      });
    });

    it('should update a student by ID', async () => {
      const id = new Id().value;
      const payload = {
        id,
        address: {
          street: 'Updated Street',
          city: 'City A',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue A',
          state: 'State A',
        },
      };
      userStudentController.update.mockResolvedValue({
        ...mockStudentData,
        ...payload,
        address: {
          ...mockStudentData.address,
          ...payload.address,
        },
      });

      const response = await supertest(app).patch(`/user-student`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(userStudentController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        ...mockStudentData,
        ...payload,
        address: {
          ...mockStudentData.address,
          ...payload.address,
        },
        birthday: mockStudentData.birthday.toISOString(),
      });
    });

    it('should delete a student by ID', async () => {
      userStudentController.delete.mockResolvedValue({
        message: 'Operation completed successfully',
      });
      const id = new Id().value;
      const response = await supertest(app).delete(`/user-student/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userStudentController.delete).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        message: 'Operation completed successfully',
      });
    });
  });

  describe('failure', () => {
    it('should return 422 for invalid id on find', async () => {
      const response = await supertest(app).get('/user-student/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(userStudentController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when student is not found', async () => {
      userStudentController.find.mockResolvedValue(null);
      const id = new Id().value;

      const response = await supertest(app).get(`/user-student/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/user-student').send({});

      expect(response.statusCode).toBe(400);
      expect(userStudentController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/user-student/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(userStudentController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/user-student').send({});

      expect(response.statusCode).toBe(400);
      expect(userStudentController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
