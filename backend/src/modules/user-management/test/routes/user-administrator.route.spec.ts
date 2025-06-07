import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserAdministratorController } from '../../interface/controller/administrator.controller';
import { UserAdministratorRoute } from '../../interface/route/administrator.route';

describe('UserAdministratorRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let userAdministratorController: UserAdministratorController;
  let middleware: AuthUserMiddleware;

  const mockAdministratorData = {
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
    birthday: '1995-11-12T00:00:00.000Z',
    salary: 'R$:2500',
    graduation: 'Math',
  };

  const mockAdministratorData2 = {
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
    birthday: '1995-11-12T00:00:00.000Z',
    salary: 'R$:3000',
    graduation: 'Computer Science',
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    userAdministratorController = {
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          ...mockAdministratorData,
          id,
        })
      ),
      findAll: jest
        .fn()
        .mockResolvedValue([mockAdministratorData, mockAdministratorData2]),
      update: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          ...mockAdministratorData,
          id,
          address: {
            ...mockAdministratorData.address,
            street: 'Updated Street',
          },
        })
      ),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as UserAdministratorController;

    middleware = {
      handle: jest.fn((_req, next) => next()),
    } as unknown as AuthUserMiddleware;

    new UserAdministratorRoute(
      userAdministratorController,
      http,
      middleware
    ).routes();
  });

  describe('success', () => {
    it('should find all administrators', async () => {
      const response = await supertest(app).get('/users-administrator');

      expect(response.statusCode).toBe(200);
      expect(userAdministratorController.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create an administrator', async () => {
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
      };
      const response = await supertest(app)
        .post('/user-administrator')
        .send(payload);

      expect(response.statusCode).toBe(201);
      expect(userAdministratorController.create).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find an administrator by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/user-administrator/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userAdministratorController.find).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should update an administrator by ID', async () => {
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
        .patch(`/user-administrator/${id}`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(userAdministratorController.update).toHaveBeenCalledWith({
        id,
        ...payload,
      });
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should delete an administrator by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/user-administrator/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userAdministratorController.delete).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get(
        '/user-administrator/invalid-id'
      );

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Id inválido' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/user-administrator/invalid-id')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Id e/ou dados para atualização inválidos',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete(
        '/user-administrator/invalid-id'
      );

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Id inválido' });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app)
        .post('/user-administrator')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: expect.any(String),
      });
    });
  });
});
