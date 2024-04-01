import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { UserStudentController } from '@/interface/controller/user-management/user-student.controller';
import { UserStudentRoute } from '@/interface/route/user-management/user-student.route';
import AuthUserMiddleware from '@/application/middleware/authUser.middleware';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      //@ts-expect-error
      handle: jest.fn((req: any, res: any, next: any) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockUserStudentController = jest.fn(() => {
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
      birthday: new Date('11-12-1995'),
      email: 'teste1@test.com',
      paymentYear: 20000,
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
        birthday: new Date('11-12-1995'),
        email: 'teste1@test.com',
        paymentYear: 20000,
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
        birthday: new Date('11-12-1995'),
        email: 'teste1@test.com',
        paymentYear: 20000,
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
      birthday: new Date('11-12-1995'),
      email: 'teste1@test.com',
      paymentYear: 20000,
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
  } as unknown as UserStudentController;
});

describe('UserStudentRoute unit test', () => {
  const userStudentController = mockUserStudentController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const userStudentRoute = new UserStudentRoute(
    userStudentController,
    expressHttp,
    authUserMiddleware
  );
  userStudentRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /user-student', () => {
    it('should create a user', async () => {
      const response = await supertest(app)
        .post('/user-student')
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
          paymentYear: 20000,
        });
      expect(response.status).toBe(201);
      expect(userStudentController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /user-student/:id', () => {
    it('should find a user by ID', async () => {
      const response = await supertest(app).get(`/user-student/${new Id().id}`);
      expect(response.status).toBe(200);
      expect(userStudentController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /user-students/', () => {
    it('should find all users', async () => {
      const response = await supertest(app).get('/user-students');
      expect(response.status).toBe(200);
      expect(userStudentController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /user-student/:id', () => {
    it('should update a user by ID', async () => {
      const response = await supertest(app)
        .patch(`/user-student/${new Id().id}`)
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
      expect(userStudentController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /user-student/:id', () => {
    it('should delete a user by ID', async () => {
      const response = await supertest(app).delete(
        `/user-student/${new Id().id}`
      );
      expect(response.status).toBe(200);
      expect(userStudentController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
});
