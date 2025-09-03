import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserTeacherController } from '../../interface/controller/teacher.controller';
import { UserTeacherRoute } from '../../interface/route/teacher.route';

describe('UserTeacherRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let userTeacherController: jest.Mocked<UserTeacherController>;
  let middleware: AuthUserMiddleware;

  const mockTeacherData = {
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
    salary: 'R$:5000',
    graduation: 'Math',
    academicDegrees: 'Msc',
  };

  const mockTeacherData2 = {
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
    salary: 'R$:6000',
    graduation: 'Computer Science',
    academicDegrees: 'PhD',
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    userTeacherController = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserTeacherController>;

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

    new UserTeacherRoute(userTeacherController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all teachers', async () => {
      userTeacherController.findAll.mockResolvedValue([
        mockTeacherData,
        mockTeacherData2,
      ]);

      const response = await supertest(app).get('/users-teacher?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(userTeacherController.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create a teacher', async () => {
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
        salary: {
          salary: 5000,
        },
        birthday: date,
        email: 'teste1@test.com',
        graduation: 'Math',
        academicDegrees: 'Msc',
      };
      const createdId = new Id().value;
      userTeacherController.create.mockResolvedValue({ id: createdId });

      const response = await supertest(app).post('/user-teacher').send(payload);

      expect(response.statusCode).toBe(201);
      expect(userTeacherController.create).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find a teacher by ID', async () => {
      const id = new Id().value;
      userTeacherController.find.mockResolvedValue({
        ...mockTeacherData,
        id,
      });

      const response = await supertest(app).get(`/user-teacher/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userTeacherController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        ...mockTeacherData,
        id,
        birthday: mockTeacherData.birthday.toISOString(),
      });
    });

    it('should update a teacher by ID', async () => {
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
      userTeacherController.update.mockResolvedValue({
        ...mockTeacherData,
        ...payload,
        address: {
          ...mockTeacherData.address,
          ...payload.address,
        },
      });

      const response = await supertest(app).patch(`/user-teacher`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(userTeacherController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        ...mockTeacherData,
        ...payload,
        address: {
          ...mockTeacherData.address,
          ...payload.address,
        },
        birthday: mockTeacherData.birthday.toISOString(),
      });
    });

    it('should delete a teacher by ID', async () => {
      userTeacherController.delete.mockResolvedValue({
        message: 'Operation completed successfully',
      });
      const id = new Id().value;
      const response = await supertest(app).delete(`/user-teacher/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userTeacherController.delete).toHaveBeenCalledWith(
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
      const response = await supertest(app).get('/user-teacher/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(userTeacherController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when teacher is not found', async () => {
      userTeacherController.find.mockResolvedValue(null);
      const id = new Id().value;

      const response = await supertest(app).get(`/user-teacher/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/user-teacher').send({});

      expect(response.statusCode).toBe(400);
      expect(userTeacherController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/user-teacher/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(userTeacherController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/user-teacher').send({});

      expect(response.statusCode).toBe(400);
      expect(userTeacherController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
