import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';

import tokenInstance from '@/main/config/tokenService/token-service.instance';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';

import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import MemoryEventRepository from '@/modules/event-calendar-management/infrastructure/repositories/memory-repository/event.repository';
import CreateEvent from '@/modules/event-calendar-management/application/usecases/event/create.usecase';
import FindEvent from '@/modules/event-calendar-management/application/usecases/event/find.usecase';
import FindAllEvent from '@/modules/event-calendar-management/application/usecases/event/find-all.usecase';
import UpdateEvent from '@/modules/event-calendar-management/application/usecases/event/update.usecase';
import DeleteEvent from '@/modules/event-calendar-management/application/usecases/event/delete.usecase';
import EventController from '@/modules/event-calendar-management/interface/controller/event.controller';
import EventRoute from '@/modules/event-calendar-management/interface/route/event.route';

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

    const expressHttp = new ExpressAdapter();
    const tokerService = tokenInstance();

    const authUserMiddlewareEvent = new AuthUserMiddleware(tokerService, [
      'master',
      'administrator',
      'student',
      'teacher',
      'worker',
    ]);

    const eventRoute = new EventRoute(
      eventController,
      expressHttp,
      authUserMiddlewareEvent
    );
    eventRoute.routes();
    app = expressHttp.getNativeServer();
  });

  describe('Event', () => {
    describe('On error', () => {
      describe('POST /event', () => {
        it('should throw an error when the data to create an event is wrong', async () => {
          const response = await supertest(app)
            .post('/event')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
              name: 'Christmas',
              date: new Date(),
              hour: '08:00' as Hour,
              day: 'mon' as DayOfWeek,
              type: 'event',
              place: 'school',
            });
          const event = await supertest(app)
            .get(`/event/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(event.status).toBe(400);
          expect(event.body.error).toBeDefined();
        });
      });
      describe('PATCH /event', () => {
        it('should throw an error when the data to update a event is wrong', async () => {
          const response = await supertest(app)
            .post('/event')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
              name: 'Christmas',
              date: new Date(),
              hour: '08:00' as Hour,
              day: 'mon' as DayOfWeek,
              type: 'event',
              place: 'school',
            });
          const id = response.body.id;
          const updatedEvent = await supertest(app)
            .patch(`/event`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id,
              name: 'Ch',
            });
          expect(updatedEvent.status).toBe(400);
          expect(updatedEvent.body.error).toBeDefined();
        });
      });
      describe('DELETE /event/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/event')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
              name: 'Christmas',
              date: new Date(),
              hour: '08:00' as Hour,
              day: 'mon' as DayOfWeek,
              type: 'event',
              place: 'school',
            });
          const result = await supertest(app)
            .delete(`/event/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /event', () => {
        it('should create an event', async () => {
          const response = await supertest(app)
            .post('/event')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
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
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
              name: 'Christmas',
              date: new Date(),
              hour: '08:00' as Hour,
              day: 'mon' as DayOfWeek,
              type: 'event',
              place: 'school',
            });
          const id = response.body.id;
          const event = await supertest(app)
            .get(`/event/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(event.status).toBe(200);
          expect(event.body).toBeDefined();
        });
      });
      describe('GET /events/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/event')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
              name: 'Christmas',
              date: new Date(),
              hour: '08:00' as Hour,
              day: 'mon' as DayOfWeek,
              type: 'event',
              place: 'school',
            });
          await supertest(app)
            .post('/event')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
              name: 'Christmas',
              date: new Date(),
              hour: '08:00' as Hour,
              day: 'mon' as DayOfWeek,
              type: 'event',
              place: 'school',
            });
          const response = await supertest(app)
            .get('/events')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /event', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/event')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
              name: 'Christmas',
              date: new Date(),
              hour: '08:00' as Hour,
              day: 'mon' as DayOfWeek,
              type: 'event',
              place: 'school',
            });
          const id = response.body.id;
          const updatedEvent = await supertest(app)
            .patch(`/event`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id,
              creator: new Id().value,
            });
          expect(updatedEvent.status).toBe(200);
          expect(updatedEvent.body).toBeDefined();
        });
      });
      describe('DELETE /event/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/event')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              creator: new Id().value,
              name: 'Christmas',
              date: new Date(),
              hour: '08:00' as Hour,
              day: 'mon' as DayOfWeek,
              type: 'event',
              place: 'school',
            });
          const id = response.body.id;
          const result = await supertest(app)
            .delete(`/event/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
});
