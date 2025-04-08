import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserMasterController } from '../../interface/controller/master.controller';
import { UserMasterRoute } from '../../interface/route/master.route';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      //@ts-expect-error
      handle: jest.fn((req: any, res: any, next: any) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockUserMasterController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().value }),
    find: jest.fn().mockResolvedValue({
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
    }),
    update: jest.fn().mockResolvedValue({
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
    }),
  } as unknown as UserMasterController;
});

describe('UserMasterRoute unit test', () => {
  const userMasterController = mockUserMasterController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const userMasterRoute = new UserMasterRoute(
    userMasterController,
    expressHttp,
    authUserMiddleware
  );
  userMasterRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /user-master', () => {
    it('should create a user', async () => {
      const response = await supertest(app)
        .post('/user-master')
        .send({
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
        });
      expect(response.status).toBe(201);
      expect(userMasterController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /user-master/:id', () => {
    it('should find a user by ID', async () => {
      const response = await supertest(app).get(
        `/user-master/${new Id().value}`
      );
      expect(response.status).toBe(200);
      expect(userMasterController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('PATCH /user-master/:id', () => {
    it('should update a user by ID', async () => {
      const response = await supertest(app)
        .patch(`/user-master/${new Id().value}`)
        .send({
          address: {
            street: 'Street B',
            city: 'City B',
            zip: '111111-111',
            number: 1,
            avenue: 'Avenue B',
            state: 'State B',
          },
        });
      expect(response.status).toBe(200);
      expect(userMasterController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
});
