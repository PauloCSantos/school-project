import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { UserWorkerController } from '@/interface/controller/user-management/user-worker.controller';
import { UserWorkerRoute } from '@/interface/route/user-management/user-worker.route';

const mockUserWorkerController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().id }),
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
      salary: {
        salary: 5000,
      },
      birthday: new Date('11-12-1995'),
      email: 'teste1@test.com',
    }),
    findAll: jest.fn().mockResolvedValue([
      {
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
      },
      {
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
        email: 'teste1@test.com',
      },
    ]),
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
      salary: {
        salary: 5000,
      },
      birthday: new Date('11-12-1995'),
      email: 'teste1@test.com',
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
  } as unknown as UserWorkerController;
});

describe('UserWorkerRoute unit test', () => {
  const userWorkerController = mockUserWorkerController();
  const expressHttp = new ExpressHttp();
  const userWorkerRoute = new UserWorkerRoute(
    userWorkerController,
    expressHttp
  );
  userWorkerRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /user-workers', () => {
    it('should create a user', async () => {
      const response = await supertest(app)
        .post('/user-workers')
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
        });
      expect(response.status).toBe(201);
      expect(userWorkerController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /user-workers/:id', () => {
    it('should find a user by ID', async () => {
      const response = await supertest(app).get('/user-workers/123');
      expect(response.status).toBe(200);
      expect(userWorkerController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /user-workers/', () => {
    it('should find all users', async () => {
      const response = await supertest(app).get('/user-workers');
      expect(response.status).toBe(200);
      expect(userWorkerController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined;
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /user-workers/:id', () => {
    it('should update a user by ID', async () => {
      const response = await supertest(app)
        .patch('/user-workers/123')
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
      expect(userWorkerController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /user-workers/:id', () => {
    it('should delete a user by ID', async () => {
      const response = await supertest(app).delete('/user-workers/123');
      expect(response.status).toBe(204);
      expect(userWorkerController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined;
    });
  });
});