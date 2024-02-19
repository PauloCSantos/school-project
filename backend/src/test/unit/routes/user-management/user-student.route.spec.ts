import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { UserStudentController } from '@/interface/controller/user-management/user-student.controller';
import { UserStudentRoute } from '@/interface/route/user-management/user-student.route';

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
  const expressHttp = new ExpressHttp();
  const userStudentRoute = new UserStudentRoute(
    userStudentController,
    expressHttp
  );
  userStudentRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /user-students', () => {
    it('should create a user', async () => {
      const response = await supertest(app)
        .post('/user-students')
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
  describe('GET /user-students/:id', () => {
    it('should find a user by ID', async () => {
      const response = await supertest(app).get('/user-students/123');
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
      expect(response.body).toBeDefined;
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /user-students/:id', () => {
    it('should update a user by ID', async () => {
      const response = await supertest(app)
        .patch('/user-students/123')
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
  describe('DELETE /user-students/:id', () => {
    it('should delete a user by ID', async () => {
      const response = await supertest(app).delete('/user-students/123');
      expect(response.status).toBe(200);
      expect(userStudentController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined;
    });
  });
});
