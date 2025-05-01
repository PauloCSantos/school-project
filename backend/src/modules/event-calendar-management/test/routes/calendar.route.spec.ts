import supertest from 'supertest';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import EventController from '../../interface/controller/calendar.controller';
import EventRoute from '../../interface/route/calendar.route';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      handle: jest.fn((_req, _res, next) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockEventController = jest.fn(
  () =>
    ({
      create: jest.fn().mockResolvedValue({
        id: new Id().value,
      }),
      find: jest.fn().mockResolvedValue({
        creator: new Id().value,
        name: 'Christmas',
        date: new Date(),
        hour: '08:00',
        day: 'mon',
        type: 'event',
        place: 'school',
      }),
      findAll: jest.fn().mockResolvedValue([
        {
          creator: new Id().value,
          name: 'Christmas',
          date: new Date(),
          hour: '08:00',
          day: 'mon',
          type: 'event',
          place: 'school',
        },
        {
          creator: new Id().value,
          name: 'Holiday',
          date: new Date(),
          hour: '08:00',
          day: 'mon',
          type: 'event',
          place: 'school',
        },
      ]),
      update: jest.fn().mockResolvedValue({
        creator: new Id().value,
        name: 'Christmas',
        date: new Date(),
        hour: '08:00',
        day: 'mon',
        type: 'event',
        place: 'school',
      }),
      delete: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    }) as unknown as EventController
);

describe('EventRoute integration tests', () => {
  const eventController = mockEventController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const eventRoute = new EventRoute(
    eventController,
    expressHttp,
    authUserMiddleware
  );
  eventRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /event', () => {
    it('should create a event', async () => {
      const response = await supertest(app).post('/event').send({
        creator: new Id().value,
        name: 'Christmas',
        date: new Date(),
        hour: '08:00',
        day: 'mon',
        type: 'event',
        place: 'school',
      });

      expect(response.status).toBe(201);
      expect(eventController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });

  describe('GET /event/:id', () => {
    it('should find a event by ID', async () => {
      const response = await supertest(app).get(`/event/${new Id().value}`);

      expect(response.status).toBe(200);
      expect(eventController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });

  describe('GET /events/', () => {
    it('should find all events', async () => {
      const response = await supertest(app).get('/events');

      expect(response.status).toBe(200);
      expect(eventController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
  });

  describe('PATCH /event/:id', () => {
    it('should update a event by ID', async () => {
      const response = await supertest(app)
        .patch(`/event/${new Id().value}`)
        .send({
          description: 'New description',
        });

      expect(response.status).toBe(200);
      expect(eventController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });

  describe('DELETE /event/:id', () => {
    it('should delete a event by ID', async () => {
      const response = await supertest(app).delete(`/event/${new Id().value}`);

      expect(response.status).toBe(200);
      expect(eventController.delete).toHaveBeenCalled();
      expect(response.body.message).toBe('Operação concluída com sucesso');
    });
  });
});
