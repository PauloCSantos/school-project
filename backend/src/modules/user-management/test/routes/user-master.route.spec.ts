import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserMasterController } from '../../interface/controller/master.controller';
import { UserMasterRoute } from '../../interface/route/master.route';

describe('UserMasterRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let userMasterController: jest.Mocked<UserMasterController>;
  let middleware: AuthUserMiddleware;

  const mockMasterData = {
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
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    cnpj: '35.741.901/0001-58',
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    userMasterController = {
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UserMasterController>;

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

    new UserMasterRoute(userMasterController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      const createdId = new Id().value;
      userMasterController.create.mockResolvedValueOnce({ id: createdId });

      const response = await supertest(app).post('/user-master').send(payload);

      expect(response.statusCode).toBe(201);
      expect(userMasterController.create).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find a master by ID', async () => {
      const id = new Id().value;
      userMasterController.find.mockResolvedValueOnce({
        ...mockMasterData,
        id,
      });

      const response = await supertest(app).get(`/user-master/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userMasterController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        ...mockMasterData,
        id,
        birthday: mockMasterData.birthday.toISOString(),
      });
    });

    it('should update a master by ID', async () => {
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

      userMasterController.update.mockResolvedValueOnce({
        ...mockMasterData,
        ...payload,
        address: {
          ...mockMasterData.address,
          ...payload.address,
        },
      });

      const response = await supertest(app).patch(`/user-master`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(userMasterController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual(
        expect.objectContaining({
          ...mockMasterData,
          ...payload,
          address: {
            ...mockMasterData.address,
            ...payload.address,
          },
          birthday: mockMasterData.birthday.toISOString(),
        })
      );
    });
  });

  describe('failure', () => {
    it('should return 422 for invalid id on find and not call controller', async () => {
      const response = await supertest(app).get('/user-master/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(userMasterController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when master is not found', async () => {
      userMasterController.find.mockResolvedValueOnce(null);
      const id = new Id().value;

      const response = await supertest(app).get(`/user-master/${id}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on update and not call controller', async () => {
      const response = await supertest(app).patch('/user-master').send({});

      expect(response.statusCode).toBe(400);
      expect(userMasterController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 400 for invalid payload on create and not call controller', async () => {
      const response = await supertest(app).post('/user-master').send({});

      expect(response.statusCode).toBe(400);
      expect(userMasterController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
