import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import EventController from '../../interface/controller/event.controller';
import EventRoute from '../../interface/route/event.route';

describe('EventRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let eventController: EventController;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    eventController = {
      findAll: jest
        .fn()
        .mockResolvedValue([{ id: new Id().value }, { id: new Id().value }]),
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) => Promise.resolve({ id })),
      update: jest.fn().mockImplementation(({ id }) => Promise.resolve({ id })),
      delete: jest
        .fn()
        .mockResolvedValue({ message: 'Operação concluída com sucesso' }),
    } as unknown as EventController;

    middleware = {
      handle: jest.fn((_req, next) => next()),
    } as unknown as AuthUserMiddleware;

    new EventRoute(eventController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all events', async () => {
      const response = await supertest(app).get('/events?quantity=2&offset=0');
      expect(response.statusCode).toBe(200);
      expect(eventController.findAll).toHaveBeenCalledWith({
        quantity: '2',
        offset: '0',
      });
      expect(response.body).toEqual(expect.any(Array));
      expect(response.body.length).toBe(2);
    });

    it('should create an event', async () => {
      const date = new Date().toISOString();
      const payload = {
        creator: new Id().value,
        name: 'Christmas',
        date,
        hour: '08:00',
        day: 'mon',
        type: 'event',
        place: 'school',
      };
      const response = await supertest(app).post('/event').send(payload);

      expect(response.statusCode).toBe(201);
      expect(eventController.create).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find an event by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/event/${id}`);

      expect(response.statusCode).toBe(200);
      expect(eventController.find).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({ id });
    });

    it('should update an event by ID', async () => {
      const id = new Id().value;
      const payload = { id, name: 'New description' };
      const response = await supertest(app).patch(`/event`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(eventController.update).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id });
    });

    it('should delete an event by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/event/${id}`);

      expect(response.statusCode).toBe(200);
      expect(eventController.delete).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid quantity or offset', async () => {
      const response = await supertest(app).get('/events?offset=invalid');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/event/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/event').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/event/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });
  });
});
