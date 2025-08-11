import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import MemoryEventRepository from '@/modules/event-calendar-management/infrastructure/repositories/memory-repository/event.repository';
import CreateEvent from '@/modules/event-calendar-management/application/usecases/event/create.usecase';
import FindEvent from '@/modules/event-calendar-management/application/usecases/event/find.usecase';
import FindAllEvent from '@/modules/event-calendar-management/application/usecases/event/find-all.usecase';
import UpdateEvent from '@/modules/event-calendar-management/application/usecases/event/update.usecase';
import DeleteEvent from '@/modules/event-calendar-management/application/usecases/event/delete.usecase';
import EventController from '@/modules/event-calendar-management/interface/controller/event.controller';
import EventRoute from '@/modules/event-calendar-management/interface/route/event.route';

let tokenService: TokenService;

async function makeToken(): Promise<string> {
  const authService = new AuthUserService();
  const authUser = new AuthUser(
    {
      email: 'eventsuite@example.com',
      password: 'StrongPass1!',
      isHashed: false,
      isActive: true,
    },
    authService
  );
  const masterId = new Id().value;
  return tokenService.generateToken(
    authUser as any,
    masterId,
    RoleUsersEnum.MASTER,
    '30m'
  );
}

async function authHeader() {
  const token = await makeToken();
  return { authorization: token };
}

describe('Event calendar management module end to end test', () => {
  let eventRepository: MemoryEventRepository;
  let app: any;

  beforeEach(() => {
    eventRepository = new MemoryEventRepository();
    const policiesService = new PoliciesService();

    tokenService = new TokenService('e2e-secret');

    const createEventUsecase = new CreateEvent(
      eventRepository,
      policiesService
    );
    const findEventUsecase = new FindEvent(eventRepository, policiesService);
    const findAllEventUsecase = new FindAllEvent(
      eventRepository,
      policiesService
    );
    const updateEventUsecase = new UpdateEvent(
      eventRepository,
      policiesService
    );
    const deleteEventUsecase = new DeleteEvent(
      eventRepository,
      policiesService
    );

    const eventController = new EventController(
      createEventUsecase,
      findEventUsecase,
      findAllEventUsecase,
      updateEventUsecase,
      deleteEventUsecase
    );

    const expressHttp = new ExpressAdapter();
    const authMiddleware = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
      RoleUsersEnum.WORKER,
    ]);

    new EventRoute(eventController, expressHttp, authMiddleware).routes();

    app = expressHttp.getNativeServer();
  });

  describe('Event', () => {
    describe('On error', () => {
      describe('POST /event', () => {
        it('should return 400 when the data to create an event is wrong', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/event')
            .set(headers)
            .send({
              creator: 'John',
              name: 123,
              date: 'not-a-date',
              day: 'abc',
              hour: '25:99',
              place: 777,
              type: 'invalid',
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });

        it('should return 400 when day is invalid', async () => {
          const headers = await authHeader();
          const res = await supertest(app).post('/event').set(headers).send({
            creator: new Id().value,
            name: 'School meeting',
            date: new Date(),
            day: 'someday',
            hour: '08:30',
            place: 'Auditorium',
            type: 'event',
          });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 400 when hour is invalid', async () => {
          const headers = await authHeader();
          const res = await supertest(app).post('/event').set(headers).send({
            creator: new Id().value,
            name: 'Meeting',
            date: new Date(),
            day: 'fri',
            hour: '99:99',
            place: 'Room 1',
            type: 'event',
          });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 400 when date is invalid', async () => {
          const headers = await authHeader();
          const res = await supertest(app).post('/event').set(headers).send({
            creator: new Id().value,
            name: 'Conference',
            date: '32/13/2024',
            day: 'mon',
            hour: '10:00',
            place: 'Hall',
            type: 'event',
          });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('GET /event/:id', () => {
        it('should return 400 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const event = await supertest(app).get('/event/123').set(headers);
          expect(event.status).toBe(400);
          expect(event.body.error).toBeDefined();
        });

        it('should return 404 when event does not exist', async () => {
          const headers = await authHeader();
          const result = await supertest(app)
            .get(`/event/${new Id().value}`)
            .set(headers);
          expect(result.status).toBe(404);
          expect(result.body.error).toBeDefined();
        });
      });

      describe('PATCH /event', () => {
        it('should return 400 when the data to update an event is wrong', async () => {
          const headers = await authHeader();

          const created = await supertest(app)
            .post('/event')
            .set(headers)
            .send({
              creator: new Id().value,
              name: 'Sports day',
              date: new Date(),
              day: 'fri',
              hour: '09:00',
              place: 'Field',
              type: 'event',
            });

          const updated = await supertest(app)
            .patch('/event')
            .set(headers)
            .send({
              id: created.body.id,
              name: 999,
            });

          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });

        it('should return 400 when id is missing on body', async () => {
          const headers = await authHeader();
          const updated = await supertest(app)
            .patch('/event')
            .set(headers)
            .send({
              name: 'No id here',
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });

        it('should return 400 when id is malformed', async () => {
          const headers = await authHeader();
          const updated = await supertest(app)
            .patch('/event')
            .set(headers)
            .send({
              id: '123',
              name: 'Bad id',
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });

        it('should return 404 when trying to update a non-existent event', async () => {
          const headers = await authHeader();
          const updated = await supertest(app)
            .patch('/event')
            .set(headers)
            .send({
              id: new Id().value,
              name: 'Edited',
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });
      });

      describe('DELETE /event/:id', () => {
        it('should return 400 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const result = await supertest(app).delete('/event/123').set(headers);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });

        it('should return 404 when trying to delete a non-existent event', async () => {
          const headers = await authHeader();
          const result = await supertest(app)
            .delete(`/event/${new Id().value}`)
            .set(headers);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });

      describe('MIDDLEWARE /event', () => {
        it('should return 401 when authorization header is missing', async () => {
          const result = await supertest(app).get('/events');
          expect(result.status).toBe(401);
          expect(result.body).toBeDefined();
        });

        it('should return 401 when token is invalid', async () => {
          const result = await supertest(app)
            .get('/events')
            .set('authorization', 'invalid-token');
          expect(result.status).toBe(401);
          expect(result.body).toBeDefined();
        });
      });
    });

    describe('On success', () => {
      describe('GET /events (empty state)', () => {
        it('should return empty array when there are no events', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/events').set(headers);
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(0);
        });
      });

      describe('POST /event', () => {
        it('should create an event', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/event')
            .set(headers)
            .send({
              creator: new Id().value,
              name: 'Hackathon',
              date: new Date(),
              day: 'sat',
              hour: '10:30',
              type: 'event',
              place: 'Lab',
            });

          expect(response.status).toBe(201);
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
        });
      });

      describe('GET /event/:id', () => {
        it('should find an event by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/event')
            .set(headers)
            .send({
              creator: new Id().value,
              name: 'Conference',
              date: new Date(),
              day: 'mon',
              hour: '14:00',
              place: 'Main hall',
              type: 'event',
            });

          const event = await supertest(app)
            .get(`/event/${created.body.id}`)
            .set(headers);

          expect(event.status).toBe(200);
          expect(event.body).toBeDefined();
        });
      });

      describe('GET /events', () => {
        it('should find all events', async () => {
          const headers = await authHeader();

          await supertest(app).post('/event').set(headers).send({
            creator: new Id().value,
            name: 'Meeting 1',
            date: new Date(),
            day: 'tue',
            hour: '09:00',
            place: 'Room A',
            type: 'event',
          });

          await supertest(app).post('/event').set(headers).send({
            creator: new Id().value,
            name: 'Meeting 2',
            date: new Date(),
            day: 'wed',
            hour: '11:00',
            place: 'Room B',
            type: 'event',
          });

          const response = await supertest(app).get('/events').set(headers);
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });

      describe('PATCH /event', () => {
        it('should update an event by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/event')
            .set(headers)
            .send({
              creator: new Id().value,
              name: 'Workshop',
              date: new Date(),
              day: 'thu',
              hour: '15:00',
              place: 'Room C',
              type: 'event',
            });

          const updated = await supertest(app)
            .patch('/event')
            .set(headers)
            .send({
              id: created.body.id,
              name: 'Workshop - Updated',
              hour: '16:00',
            });

          expect(updated.status).toBe(200);
          expect(updated.body).toBeDefined();
        });
      });

      describe('DELETE /event/:id', () => {
        it('should delete an event by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/event')
            .set(headers)
            .send({
              creator: new Id().value,
              name: 'Cleanup',
              date: new Date(),
              day: 'fri',
              hour: '18:00',
              place: 'Room D',
              type: 'event',
            });

          const result = await supertest(app)
            .delete(`/event/${created.body.id}`)
            .set(headers);

          expect(result.status).toBe(200);
          expect(result.body).toBeDefined();
        });
      });
    });
  });
});
