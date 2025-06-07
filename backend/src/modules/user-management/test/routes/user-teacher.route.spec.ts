import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import { UserTeacherController } from '../../interface/controller/teacher.controller';
import { UserTeacherRoute } from '../../interface/route/teacher.route';

describe('UserTeacherRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let userTeacherController: UserTeacherController;
  let middleware: AuthUserMiddleware;

  const mockTeacherData = {
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
    graduation: 'Math',
    academicDegrees: 'Msc',
  };

  const mockTeacherData2 = {
    id: new Id().value,
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
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    userTeacherController = {
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          ...mockTeacherData,
          id,
        })
      ),
      findAll: jest.fn().mockResolvedValue([mockTeacherData, mockTeacherData2]),
      update: jest.fn().mockImplementation(({ id }) =>
        Promise.resolve({
          ...mockTeacherData,
          id,
          address: {
            ...mockTeacherData.address,
            street: 'Updated Street',
          },
        })
      ),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as UserTeacherController;

    middleware = {
      handle: jest.fn((_req, next) => next()),
    } as unknown as AuthUserMiddleware;

    new UserTeacherRoute(userTeacherController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all teachers', async () => {
      const response = await supertest(app).get('/users-teacher');

      expect(response.statusCode).toBe(200);
      expect(userTeacherController.findAll).toHaveBeenCalled();
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create a teacher', async () => {
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
        academicDegrees: 'Msc',
      };
      const response = await supertest(app).post('/user-teacher').send(payload);

      expect(response.statusCode).toBe(201);
      expect(userTeacherController.create).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find a teacher by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/user-teacher/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userTeacherController.find).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should update a teacher by ID', async () => {
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
        .patch(`/user-teacher/${id}`)
        .send(payload);

      expect(response.statusCode).toBe(200);
      expect(userTeacherController.update).toHaveBeenCalledWith({
        id,
        ...payload,
      });
      expect(response.body).toEqual(expect.objectContaining({ id }));
    });

    it('should delete a teacher by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/user-teacher/${id}`);

      expect(response.statusCode).toBe(200);
      expect(userTeacherController.delete).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/user-teacher/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Id inválido' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/user-teacher/invalid-id')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Id e/ou dados para atualização inválidos',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/user-teacher/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Id inválido' });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/user-teacher').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: expect.any(String),
      });
    });
  });
});
