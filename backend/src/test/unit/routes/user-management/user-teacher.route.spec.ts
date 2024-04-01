import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { UserTeacherController } from '@/interface/controller/user-management/user-teacher.controller';
import { UserTeacherRoute } from '@/interface/route/user-management/user-teacher.route';
import AuthUserMiddleware from '@/application/middleware/authUser.middleware';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      //@ts-expect-error
      handle: jest.fn((req: any, res: any, next: any) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockUserTeacherController = jest.fn(() => {
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
      graduation: 'Math',
      academicDegrees: 'Msc',
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
        graduation: 'Math',
        academicDegrees: 'Msc',
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
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
        salary: {
          salary: 5000,
        },
        birthday: new Date('11-12-1995'),
        email: 'teste2@test.com',
        graduation: 'Math',
        academicDegrees: 'Msc',
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
      graduation: 'Math',
      academicDegrees: 'Msc',
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
  } as unknown as UserTeacherController;
});

describe('UserTeacherRoute unit test', () => {
  const userTeacherController = mockUserTeacherController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const userTeacherRoute = new UserTeacherRoute(
    userTeacherController,
    expressHttp,
    authUserMiddleware
  );
  userTeacherRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /user-teacher', () => {
    it('should create a user', async () => {
      const response = await supertest(app)
        .post('/user-teacher')
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
          academicDegrees: 'Msc',
        });
      expect(response.status).toBe(201);
      expect(userTeacherController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /user-teacher/:id', () => {
    it('should find a user by ID', async () => {
      const response = await supertest(app).get(`/user-teacher/${new Id().id}`);
      expect(response.status).toBe(200);
      expect(userTeacherController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /user-teachers/', () => {
    it('should find all users', async () => {
      const response = await supertest(app).get('/user-teachers');
      expect(response.status).toBe(200);
      expect(userTeacherController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /user-teacher/:id', () => {
    it('should update a user by ID', async () => {
      const response = await supertest(app)
        .patch(`/user-teacher/${new Id().id}`)
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
      expect(userTeacherController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /user-teacher/:id', () => {
    it('should delete a user by ID', async () => {
      const response = await supertest(app).delete(
        `/user-teacher/${new Id().id}`
      );
      expect(response.status).toBe(200);
      expect(userTeacherController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
});
