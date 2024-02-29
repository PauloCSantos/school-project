import CreateEvent from '@/application/usecases/event-calendar-management/event/createEvent.usecase';
import DeleteEvent from '@/application/usecases/event-calendar-management/event/deleteEvent.usecase';
import FindAllEvent from '@/application/usecases/event-calendar-management/event/findAllEvent.usecase';
import FindEvent from '@/application/usecases/event-calendar-management/event/findEvent.usecase';
import UpdateEvent from '@/application/usecases/event-calendar-management/event/updateEvent.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryEventRepository from '@/infraestructure/repositories/event-calendar-management/memory-repository/event.repository';
import { EventController } from '@/interface/controller/event-calendar-management/event.controller';
import { EventRoute } from '@/interface/route/event-calendar-management/event.route';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';

describe('Event calendar management module end to end test', () => {
  let eventRepository = new MemoryEventRepository();

  let app: any;
  beforeEach(() => {
    eventRepository = new MemoryEventRepository();

    const createEventUsecase = new CreateEvent(eventRepository);
    const findEventUsecase = new FindEvent(eventRepository);
    const findAllEventUsecase = new FindAllEvent(eventRepository);
    const updateEventUsecase = new UpdateEvent(eventRepository);
    const deleteEventUsecase = new DeleteEvent(eventRepository);

    const eventController = new EventController(
      createEventUsecase,
      findEventUsecase,
      findAllEventUsecase,
      updateEventUsecase,
      deleteEventUsecase
    );

    const expressHttp = new ExpressHttp();
    const eventRoute = new EventRoute(eventController, expressHttp);
    eventRoute.routes();
    app = expressHttp.getExpressInstance();
  });

  describe('Event', () => {
    describe('On error', () => {
      describe('POST /event', () => {
        it('should throw an error when the data to create an event is wrong', async () => {
          const response = await supertest(app)
            .post('/event')
            .send({
              creator: new Id().id,
              name: 'Christmas',
              date: new Date(),
              hour: '08:00' as Hour,
              day: 'mon' as DayOfWeek,
              place: 'school',
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /event/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app)
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
          const event = await supertest(app).get(`/event/123`);
          expect(event.status).toBe(400);
          expect(event.body.error).toBeDefined;
        });
      });
      describe('PATCH /event/:id', () => {
        it('should throw an error when the data to update a event is wrong', async () => {
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
          const id = response.body.id;
          const updatedEvent = await supertest(app).patch(`/event/${id}`).send({
            name: 'Chs',
          });
          expect(updatedEvent.status).toBe(404);
          expect(updatedEvent.body.error).toBeDefined();
        });
      });
      describe('DELETE /event/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
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
          const result = await supertest(app).delete(`/event/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /event', () => {
        it('should create an event', async () => {
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
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /event/:id', () => {
        it('should find a user by ID', async () => {
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
          const id = response.body.id;
          const event = await supertest(app).get(`/event/${id}`);
          expect(event.status).toBe(200);
          expect(event.body).toBeDefined();
        });
      });
      describe('GET /events/', () => {
        it('should find all users', async () => {
          await supertest(app)
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
          await supertest(app)
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
          const response = await supertest(app).get('/events');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /event/:id', () => {
        it('should update a user by ID', async () => {
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
          const id = response.body.id;
          const updatedEvent = await supertest(app).patch(`/event/${id}`).send({
            creator: new Id().id,
          });
          expect(updatedEvent.status).toBe(200);
          expect(updatedEvent.body).toBeDefined();
        });
      });
      describe('DELETE /event/:id', () => {
        it('should delete a user by ID', async () => {
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
          const id = response.body.id;
          const result = await supertest(app).delete(`/event/${id}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
});
