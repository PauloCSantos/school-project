import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import EventController from '../../interface/controller/event.controller';
import EventRoute from '../../interface/route/event.route';

describe('EventRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let eventController: jest.Mocked<EventController>;
  let middleware: AuthUserMiddleware;

  const baseEvent = {
    creator: new Id().value,
    name: 'Christmas',
    date: new Date(),
    hour: '08:00',
    day: 'mon',
    type: 'event',
    place: 'school',
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    eventController = {
      findAll: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<EventController>;

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

    new EventRoute(eventController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all events with pagination', async () => {
      eventController.findAll.mockResolvedValue([
        { id: new Id().value, ...baseEvent },
        { id: new Id().value, ...baseEvent, name: 'New Year' },
      ]);

      const response = await supertest(app).get('/events?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(eventController.findAll).toHaveBeenCalledWith(
        { quantity: '2', offset: '0' },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should create an event', async () => {
      const createdId = new Id().value;
      eventController.create.mockResolvedValue({ id: createdId });

      const response = await supertest(app).post('/event').send(baseEvent);

      expect(response.statusCode).toBe(201);
      expect(eventController.create).toHaveBeenCalledWith(
        { ...baseEvent, date: baseEvent.date.toISOString() },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find an event by ID', async () => {
      const id = new Id().value;
      eventController.find.mockResolvedValue({ id, ...baseEvent });

      const response = await supertest(app).get(`/event/${id}`);

      expect(response.statusCode).toBe(200);
      expect(eventController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        id,
        ...baseEvent,
        date: baseEvent.date.toISOString(),
      });
    });

    it('should update an event by ID', async () => {
      const id = new Id().value;
      const payload = { id, name: 'Updated name' };
      eventController.update.mockResolvedValue({ ...baseEvent, ...payload, id });

      const response = await supertest(app).patch('/event').send(payload);

      expect(response.statusCode).toBe(200);
      expect(eventController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({
        ...baseEvent,
        ...payload,
        id,
        date: baseEvent.date.toISOString(),
      });
    });

    it('should delete an event by ID', async () => {
      const id = new Id().value;
      eventController.delete.mockResolvedValue({
        message: 'Operation completed successfully',
      });

      const response = await supertest(app).delete(`/event/${id}`);

      expect(response.statusCode).toBe(200);
      expect(eventController.delete).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: 'Operation completed successfully' });
    });
  });

  describe('failure', () => {
    it('should return 422 for invalid quantity or offset', async () => {
      const response = await supertest(app).get('/events?offset=invalid');

      expect(response.statusCode).toBe(422);
      expect(eventController.findAll).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on find', async () => {
      const response = await supertest(app).get('/event/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(eventController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when event is not found', async () => {
      const id = new Id().value;
      eventController.find.mockResolvedValue(null as any);

      const response = await supertest(app).get(`/event/${id}`);

      expect(response.statusCode).toBe(404);
      expect(eventController.find).toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid payload on create', async () => {
      const response = await supertest(app).post('/event').send({});

      expect(response.statusCode).toBe(400);
      expect(eventController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for missing id on update', async () => {
      const response = await supertest(app).patch('/event').send({ name: 'No id' });

      expect(response.statusCode).toBe(400);
      expect(eventController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/event')
        .send({ id: 'invalid-id', name: 'X' });

      expect(response.statusCode).toBe(422);
      expect(eventController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/event/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(eventController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
