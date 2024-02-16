import { UserAdministratorController } from '@/interface/controller/user-management/user-administrator.controller';
import { UserAdministratorRoute } from '@/interface/route/user-management/user-administrator.route';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';

const mockUserAdministratorController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().id }),
    find: jest.fn().mockResolvedValue({
      name: { fullName: 'John David Doe', shortName: 'John D D' },
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
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        name: { fullName: 'John David Doe', shortName: 'John D D' },
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
      },
      {
        name: { fullName: 'John David Doe', shortName: 'John D D' },
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
      },
    ]),
    update: jest.fn().mockResolvedValue({
      name: { fullName: 'John David Doe', shortName: 'John D D' },
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
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
  } as unknown as UserAdministratorController;
});

describe('UserAdministratorRoute unit test', () => {
  const userAdministratorController = mockUserAdministratorController();
  const expressHttp = new ExpressHttp();
  const userAdministratorRoute = new UserAdministratorRoute(
    userAdministratorController,
    expressHttp
  );
  userAdministratorRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /user-administrators', () => {
    it('should create a user', async () => {
      const response = await supertest(app)
        .post('/user-administrators')
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
          salary: {
            salary: 5000,
          },
          birthday: new Date('11-12-1995'),
          email: 'teste1@test.com',
          graduation: 'Math',
        });
      expect(response.status).toBe(201);
      expect(userAdministratorController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /user-administrators/:id', () => {
    it('should find a user by ID', async () => {
      const response = await supertest(app).get('/user-administrators/123');
      expect(response.status).toBe(200);
      expect(userAdministratorController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /user-administrators/', () => {
    it('should find all users', async () => {
      const response = await supertest(app).get('/user-administrators');
      expect(response.status).toBe(200);
      expect(userAdministratorController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined;
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /user-administrators/:id', () => {
    it('should update a user by ID', async () => {
      const response = await supertest(app)
        .patch('/user-administrators/123')
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
      expect(userAdministratorController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /user-administrators/:id', () => {
    it('should delete a user by ID', async () => {
      const response = await supertest(app).delete('/user-administrators/123');
      expect(response.status).toBe(200);
      expect(userAdministratorController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined;
    });
  });
});
