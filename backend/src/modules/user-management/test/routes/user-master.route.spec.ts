import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserMasterController } from '../../interface/controller/master.controller';
import { UserMasterRoute } from '../../interface/route/master.route';

describe('UserMasterRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let userMasterController: UserMasterController;
  let middleware: AuthUserMiddleware;

  const mockMasterData = {
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
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    cnpj: '35.741.901/0001-58',
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    userMasterController = {
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          ...mockMasterData,
          id,
        })
      ),
      update: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          ...mockMasterData,
          id,
          address: {
            ...mockMasterData.address,
            street: 'Updated Street',
          },
        })
      ),
    } as unknown as UserMasterController;

    middleware = {
      handle: jest.fn((_req, next) => next()),
    } as unknown as AuthUserMiddleware;

    new UserMasterRoute(userMasterController, http, middleware).routes();
  });

  describe('success', () => {
    it('should create a master', async () => {
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
        birthday: date,
        email: 'teste1@test.com',
        cnpj: '35.741.901/0001-58',
      };
      const response = await supertest(app).post('/user-master').send(payload);

      expect(response.statusCode).toBe(201);
      expect(userMasterController.create).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find a master by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/user-master/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userMasterController.find).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should update a master by ID', async () => {
      const id = new Id().value;
      const payload = {
        address: {
          street: 'Updated Street',
          city: 'City A',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue A',
          state: 'State A',
        },
      };
      const response = await supertest(app)
        .patch(`/user-master/${id}`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(userMasterController.update).toHaveBeenCalledWith({
        id,
        ...payload,
      });
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/user-master/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Id inválido' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/user-master/invalid-id')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Id e/ou dados para atualização inválidos',
      });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/user-master').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: expect.any(String),
      });
    });
  });
});
