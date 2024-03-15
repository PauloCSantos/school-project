import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { EventController } from '@/interface/controller/event-calendar-management/event.controller';
import { EventRoute } from '@/interface/route/event-calendar-management/event.route';

const mockEventController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().id }),
    find: jest.fn().mockResolvedValue({
      creator: new Id().id,
      name: 'Christmas',
      date: new Date(),
      hour: '08:00' as Hour,
      day: 'mon' as DayOfWeek,
      type: 'event',
      place: 'school',
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        creator: new Id().id,
        name: 'Christmas',
        date: new Date(),
        hour: '08:00' as Hour,
        day: 'mon' as DayOfWeek,
        type: 'event',
        place: 'school',
      },
      {
        creator: new Id().id,
        name: 'Holiday',
        date: new Date(),
        hour: '08:00' as Hour,
        day: 'mon' as DayOfWeek,
        type: 'event',
        place: 'school',
      },
    ]),
    update: jest.fn().mockResolvedValue({
      creator: new Id().id,
      name: 'Christmas',
      date: new Date(),
      hour: '08:00' as Hour,
      day: 'mon' as DayOfWeek,
      type: 'event',
      place: 'school',
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
  } as unknown as EventController;
});

describe('EventRoute unit test', () => {
  const eventController = mockEventController();
  const expressHttp = new ExpressHttp();
  const eventRoute = new EventRoute(eventController, expressHttp);
  eventRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /event', () => {
    it('should create a event', async () => {
      const response = await supertest(app)
        .post('/event')
        .send({
          creator: new Id().id,
          name: 'Christmas',
          date: new Date(),
          hour: '08:00' as Hour,
          day: 'mon' as DayOfWeek,
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
      const response = await supertest(app).get(`/event/${new Id().id}`);
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
        .patch(`/event/${new Id().id}`)
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
      const response = await supertest(app).delete(`/event/${new Id().id}`);
      expect(response.status).toBe(200);
      expect(eventController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
});
