import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserWorkerController } from '../../interface/controller/worker.controller';
import { UserWorkerRoute } from '../../interface/route/worker.route';

describe('UserWorkerRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let userWorkerController: jest.Mocked<UserWorkerController>;
  let middleware: AuthUserMiddleware;

  const mockWorkerData = {
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
    salary: 'R$:2500',
  };

  const mockWorkerData2 = {
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
    salary: 'R$:3000',
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    userWorkerController = {
      create: jest.fn(),
      find: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserWorkerController>;

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

    new UserWorkerRoute(userWorkerController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all workers', async () => {
      userWorkerController.findAll.mockResolvedValue([mockWorkerData, mockWorkerData2]);

      const response = await supertest(app).get('/users-worker?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(userWorkerController.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create a worker', async () => {
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
      };
      const createdId = new Id().value;
      userWorkerController.create.mockResolvedValue({ id: createdId });

      const response = await supertest(app).post('/user-worker').send(payload);

      expect(response.statusCode).toBe(201);
      expect(userWorkerController.create).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find a worker by ID', async () => {
      const id = new Id().value;
      userWorkerController.find.mockResolvedValue({
        ...mockWorkerData,
        id,
      });

      const response = await supertest(app).get(`/user-worker/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userWorkerController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        ...mockWorkerData,
        id,
        birthday: mockWorkerData.birthday.toISOString(),
      });
    });

    it('should update a worker by ID', async () => {
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
      userWorkerController.update.mockResolvedValue({
        ...mockWorkerData,
        ...payload,
        address: {
          ...mockWorkerData.address,
          ...payload.address,
        },
      });

      const response = await supertest(app).patch(`/user-worker`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(userWorkerController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        ...mockWorkerData,
        ...payload,
        address: {
          ...mockWorkerData.address,
          ...payload.address,
        },
        birthday: mockWorkerData.birthday.toISOString(),
      });
    });

    it('should delete a worker by ID', async () => {
      userWorkerController.delete.mockResolvedValue({
        message: 'Operation completed successfully',
      });
      const id = new Id().value;
      const response = await supertest(app).delete(`/user-worker/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userWorkerController.delete).toHaveBeenCalledWith(
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
      const response = await supertest(app).get('/user-worker/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(userWorkerController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when worker is not found', async () => {
      userWorkerController.find.mockResolvedValue(null);
      const id = new Id().value;

      const response = await supertest(app).get(`/user-worker/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/user-worker').send({});

      expect(response.statusCode).toBe(400);
      expect(userWorkerController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/user-worker/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(userWorkerController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/user-worker').send({});

      expect(response.statusCode).toBe(400);
      expect(userWorkerController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
