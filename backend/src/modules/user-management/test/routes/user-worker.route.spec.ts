import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserWorkerController } from '../../interface/controller/worker.controller';
import { UserWorkerRoute } from '../../interface/route/worker.route';

describe('UserWorkerRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let userWorkerController: UserWorkerController;
  let middleware: AuthUserMiddleware;

  const mockWorkerData = {
    id: new Id().value,
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
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
  };

  const mockWorkerData2 = {
    id: new Id().value,
    name: {
      firstName: 'Marie',
      lastName: 'Doe',
    },
    address: {
      street: 'Street B',
      city: 'City B',
      zip: '111111-111',
      number: 2,
      avenue: 'Avenue B',
      state: 'State B',
    },
    salary: {
      salary: 5000,
    },
    birthday: new Date('11-12-1995'),
    email: 'teste2@test.com',
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    userWorkerController = {
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          ...mockWorkerData,
          id,
        })
      ),
      findAll: jest.fn().mockResolvedValue([mockWorkerData, mockWorkerData2]),
      update: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          ...mockWorkerData,
          id,
          address: {
            ...mockWorkerData.address,
            street: 'Updated Street',
          },
        })
      ),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as UserWorkerController;

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

    new UserWorkerRoute(userWorkerController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all workers', async () => {
      const response = await supertest(app).get('/users-worker');

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
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find a worker by ID', async () => {
      const id = new Id().value;
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
      expect(response.body).toEqual(expect.objectContaining({ id }));
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
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should delete a worker by ID', async () => {
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
        message: 'Operação concluída com sucesso',
      });
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/user-worker/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/user-worker').send({});
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/user-worker/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/user-worker').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: expect.any(String),
      });
    });
  });
});
