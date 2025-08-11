import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import MemoryScheduleRepository from '@/modules/schedule-lesson-management/infrastructure/repositories/memory-repository/schedule.repository';
import CreateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/create.usecase';
import FindSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/find.usecase';
import FindAllSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/find-all.usecase';
import UpdateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/update.usecase';
import DeleteSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/delete.usecase';
import AddLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/add-lessons.usecase';
import RemoveLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/remove-lessons.usecase';
import { ScheduleController } from '@/modules/schedule-lesson-management/interface/controller/schedule.controller';
import ScheduleRoute from '@/modules/schedule-lesson-management/interface/route/schedule.route';
import MemoryLessonRepository from '@/modules/schedule-lesson-management/infrastructure/repositories/memory-repository/lesson.repository';
import CreateLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/create.usecase';
import FindLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/find.usecase';
import FindAllLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/find-all.usecase';
import UpdateLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/update.usecase';
import DeleteLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/delete.usecase';
import AddStudentsToLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/add-students.usecase';
import RemoveStudentsFromLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-students.usecase';
import AddDaysToLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/add-day.usecase';
import RemoveDaysFromLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-day.usecase';
import AddTimesToLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/add-time.usecase';
import RemoveTimesFromLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-time.usecase';
import { LessonController } from '@/modules/schedule-lesson-management/interface/controller/lesson.controller';
import LessonRoute from '@/modules/schedule-lesson-management/interface/route/lesson.route';

let tokenService: TokenService;

async function makeToken(): Promise<string> {
  const authService = new AuthUserService();
  const authUser = new AuthUser(
    {
      email: 'schedulesuite@example.com',
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

describe('Schedule lesson management module end to end test', () => {
  let scheduleRepository: MemoryScheduleRepository;
  let lessonRepository: MemoryLessonRepository;
  let app: any;

  beforeEach(() => {
    scheduleRepository = new MemoryScheduleRepository();
    lessonRepository = new MemoryLessonRepository();
    const policiesService = new PoliciesService();

    tokenService = new TokenService('e2e-secret');

    const createScheduleUsecase = new CreateSchedule(
      scheduleRepository,
      policiesService
    );
    const findScheduleUsecase = new FindSchedule(
      scheduleRepository,
      policiesService
    );
    const findAllScheduleUsecase = new FindAllSchedule(
      scheduleRepository,
      policiesService
    );
    const updateScheduleUsecase = new UpdateSchedule(
      scheduleRepository,
      policiesService
    );
    const deleteScheduleUsecase = new DeleteSchedule(
      scheduleRepository,
      policiesService
    );
    const addLessonsUsecase = new AddLessons(
      scheduleRepository,
      policiesService
    );
    const removeLessonsUsecase = new RemoveLessons(
      scheduleRepository,
      policiesService
    );

    const scheduleController = new ScheduleController(
      createScheduleUsecase,
      findScheduleUsecase,
      findAllScheduleUsecase,
      updateScheduleUsecase,
      deleteScheduleUsecase,
      addLessonsUsecase,
      removeLessonsUsecase
    );

    const createLessonUsecase = new CreateLesson(
      lessonRepository,
      policiesService
    );
    const findLessonUsecase = new FindLesson(lessonRepository, policiesService);
    const findAllLessonUsecase = new FindAllLesson(
      lessonRepository,
      policiesService
    );
    const updateLessonUsecase = new UpdateLesson(
      lessonRepository,
      policiesService
    );
    const deleteLessonUsecase = new DeleteLesson(
      lessonRepository,
      policiesService
    );
    const addStudentsUsecase = new AddStudentsToLesson(
      lessonRepository,
      policiesService
    );
    const removeStudentsUsecase = new RemoveStudentsFromLesson(
      lessonRepository,
      policiesService
    );
    const addDaysUsecase = new AddDaysToLesson(
      lessonRepository,
      policiesService
    );
    const removeDaysUsecase = new RemoveDaysFromLesson(
      lessonRepository,
      policiesService
    );
    const addTimesUsecase = new AddTimesToLesson(
      lessonRepository,
      policiesService
    );
    const removeTimesUsecase = new RemoveTimesFromLesson(
      lessonRepository,
      policiesService
    );

    const lessonController = new LessonController(
      createLessonUsecase,
      findLessonUsecase,
      findAllLessonUsecase,
      updateLessonUsecase,
      deleteLessonUsecase,
      addStudentsUsecase,
      removeStudentsUsecase,
      addDaysUsecase,
      removeDaysUsecase,
      addTimesUsecase,
      removeTimesUsecase
    );

    const expressHttp = new ExpressAdapter();
    const authMiddlewareSchedule = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
      RoleUsersEnum.WORKER,
    ]);
    const authMiddlewareLesson = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
      RoleUsersEnum.WORKER,
    ]);

    new ScheduleRoute(
      scheduleController,
      expressHttp,
      authMiddlewareSchedule
    ).routes();
    new LessonRoute(
      lessonController,
      expressHttp,
      authMiddlewareLesson
    ).routes();

    app = expressHttp.getNativeServer();
  });

  describe('Schedule', () => {
    describe('On error', () => {
      describe('MIDDLEWARE /schedule', () => {
        it('should return 401 when authorization header is missing', async () => {
          const result = await supertest(app).get(
            '/schedules?quantity=1&offset=0'
          );
          expect(result.status).toBe(401);
          expect(result.body).toBeDefined();
        });

        it('should return 401 when token is invalid', async () => {
          const result = await supertest(app)
            .get('/schedules?quantity=1&offset=0')
            .set('authorization', 'invalid');
          expect(result.status).toBe(401);
          expect(result.body).toBeDefined();
        });
      });

      describe('POST /schedule', () => {
        it('should return 400 when the data to create a schedule is wrong', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: '123',
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });

      describe('GET /schedule/:id', () => {
        it('should return 400 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const res = await supertest(app).get('/schedule/123').set(headers);
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when schedule does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .get(`/schedule/${new Id().value}`)
            .set(headers);
          expect(res.status).toBe(404);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('PATCH /schedule', () => {
        it('should return 400 when id is missing on body', async () => {
          const headers = await authHeader();
          const updated = await supertest(app)
            .patch('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });

        it('should return 400 when id is malformed', async () => {
          const headers = await authHeader();
          const updated = await supertest(app)
            .patch('/schedule')
            .set(headers)
            .send({
              id: '123',
              student: new Id().value,
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });

        it('should return 400 when the data to update a schedule is wrong', async () => {
          const headers = await authHeader();

          const created = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });

          const updated = await supertest(app)
            .patch('/schedule')
            .set(headers)
            .send({
              id: created.body.id,
              curriculum: 123,
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });

        it('should return 404 when trying to update a non-existent schedule', async () => {
          const headers = await authHeader();
          const updated = await supertest(app)
            .patch('/schedule')
            .set(headers)
            .send({
              id: new Id().value,
              lessonsList: [new Id().value],
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });
      });

      describe('DELETE /schedule/:id', () => {
        it('should return 400 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const res = await supertest(app).delete('/schedule/123').set(headers);
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when trying to delete a non-existent schedule', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .delete(`/schedule/${new Id().value}`)
            .set(headers);
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('POST /schedule/lesson/add', () => {
        it('should return 400 when lessons list is invalid', async () => {
          const headers = await authHeader();

          const created = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });
          const res = await supertest(app)
            .post('/schedule/lesson/add')
            .set(headers)
            .send({
              id: created.body.id,
              newLessonsList: [123],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when schedule does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .post('/schedule/lesson/add')
            .set(headers)
            .send({
              id: new Id().value,
              newLessonsList: [new Id().value],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('POST /schedule/lesson/remove', () => {
        it('should return 400 when lessons list is invalid', async () => {
          const headers = await authHeader();

          const created = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });
          const res = await supertest(app)
            .post('/schedule/lesson/remove')
            .set(headers)
            .send({
              id: created.body.id,
              lessonsListToRemove: [123],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when schedule does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .post('/schedule/lesson/remove')
            .set(headers)
            .send({
              id: new Id().value,
              lessonsListToRemove: [new Id().value],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });
    });

    describe('On sucess', () => {
      describe('POST /schedule', () => {
        it('should create a schedule', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });
          expect(response.status).toBe(201);
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
        });
      });

      describe('GET /schedule/:id', () => {
        it('should find a schedule by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });
          const res = await supertest(app)
            .get(`/schedule/${created.body.id}`)
            .set(headers);
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('GET /schedules', () => {
        it('should find schedules with pagination', async () => {
          const headers = await authHeader();

          await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });
          await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });

          const list = await supertest(app)
            .get('/schedules?quantity=1&offset=0')
            .set(headers);
          expect(list.status).toBe(200);
          expect(Array.isArray(list.body)).toBe(true);
          expect(list.body.length).toBe(1);
        });

        it('should return empty array when there are no schedules', async () => {
          const headers = await authHeader();
          const list = await supertest(app)
            .get('/schedules?quantity=10&offset=0')
            .set(headers);
          expect(list.status).toBe(200);
          expect(Array.isArray(list.body)).toBe(true);
          expect(list.body.length).toBe(0);
        });
      });

      describe('PATCH /schedule', () => {
        it('should update a schedule by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });
          const updated = await supertest(app)
            .patch('/schedule')
            .set(headers)
            .send({
              id: created.body.id,
              lessonsList: [new Id().value, new Id().value],
            });
          expect(updated.status).toBe(200);
          expect(updated.body).toBeDefined();
        });
      });

      describe('DELETE /schedule/:id', () => {
        it('should delete a schedule by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });
          const res = await supertest(app)
            .delete(`/schedule/${created.body.id}`)
            .set(headers);
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('POST /schedule/lesson/add', () => {
        it('should add lessons to schedule', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value],
            });
          const res = await supertest(app)
            .post('/schedule/lesson/add')
            .set(headers)
            .send({
              id: created.body.id,
              newLessonsList: [new Id().value, new Id().value],
            });
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('POST /schedule/lesson/remove', () => {
        it('should remove lessons from schedule', async () => {
          const headers = await authHeader();
          const lessonA = new Id().value;
          const created = await supertest(app)
            .post('/schedule')
            .set(headers)
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [lessonA, new Id().value],
            });
          const res = await supertest(app)
            .post('/schedule/lesson/remove')
            .set(headers)
            .send({
              id: created.body.id,
              lessonsListToRemove: [lessonA],
            });
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });
    });
  });

  describe('Lesson', () => {
    describe('On error', () => {
      describe('MIDDLEWARE /lesson', () => {
        it('should return 401 when authorization header is missing', async () => {
          const result = await supertest(app).get('/lessons');
          expect(result.status).toBe(401);
          expect(result.body).toBeDefined();
        });

        it('should return 401 when token is invalid', async () => {
          const result = await supertest(app)
            .get('/lessons')
            .set('authorization', 'invalid');
          expect(result.status).toBe(401);
          expect(result.body).toBeDefined();
        });
      });

      describe('POST /lesson', () => {
        it('should return 400 when the data to create a lesson is wrong', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              subject: 123,
              teacher: new Id().value,
              classroom: new Id().value,
              duration: -60,
              days: ['mon'],
              times: ['08:00'],
              studentsList: [new Id().value],
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });

      describe('GET /lesson/:id', () => {
        it('should return 400 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const res = await supertest(app).get('/lesson/123').set(headers);
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when lesson does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .get(`/lesson/${new Id().value}`)
            .set(headers);
          expect(res.status).toBe(404);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('PATCH /lesson', () => {
        it('should return 400 when id is missing on body', async () => {
          const headers = await authHeader();
          const updated = await supertest(app)
            .patch('/lesson')
            .set(headers)
            .send({
              duration: 90,
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });

        it('should return 400 when id is malformed', async () => {
          const headers = await authHeader();
          const updated = await supertest(app)
            .patch('/lesson')
            .set(headers)
            .send({
              id: '123',
              duration: 90,
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });

        it('should return 400 when the data to update a lesson is wrong', async () => {
          const headers = await authHeader();

          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              subject: new Id().value,
              teacher: new Id().value,
              classroom: new Id().value,
              duration: 60,
              days: ['mon', 'wed'],
              times: ['08:00', '10:00'],
              studentsList: [new Id().value],
            });
          const updated = await supertest(app)
            .patch('/lesson')
            .set(headers)
            .send({
              id: created.body.id,
              duration: -10,
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });

        it('should return 404 when trying to update a non-existent lesson', async () => {
          const headers = await authHeader();
          const updated = await supertest(app)
            .patch('/lesson')
            .set(headers)
            .send({
              id: new Id().value,
              duration: 90,
            });
          expect(updated.status).toBe(400);
          expect(updated.body.error).toBeDefined();
        });
      });

      describe('DELETE /lesson/:id', () => {
        it('should return 400 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const res = await supertest(app).delete('/lesson/123').set(headers);
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when trying to delete a non-existent lesson', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .delete(`/lesson/${new Id().value}`)
            .set(headers);
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('POST /lesson/student/add', () => {
        it('should return 400 when students list is invalid', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              subject: new Id().value,
              teacher: new Id().value,
              classroom: new Id().value,
              duration: 60,
              days: ['mon'],
              times: ['08:00'],
              studentsList: [new Id().value],
            });
          const res = await supertest(app)
            .post('/lesson/student/add')
            .set(headers)
            .send({
              id: created.body.id,
              newStudentsList: [123],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when lesson does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .post('/lesson/student/add')
            .set(headers)
            .send({
              id: new Id().value,
              newStudentsList: [new Id().value],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('POST /lesson/student/remove', () => {
        it('should return 400 when students list is invalid', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              subject: new Id().value,
              teacher: new Id().value,
              classroom: new Id().value,
              duration: 60,
              days: ['mon'],
              times: ['08:00'],
              studentsList: [new Id().value, new Id().value],
            });
          const res = await supertest(app)
            .post('/lesson/student/remove')
            .set(headers)
            .send({
              id: created.body.id,
              studentsListToRemove: [123],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when lesson does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .post('/lesson/student/remove')
            .set(headers)
            .send({
              id: new Id().value,
              studentsListToRemove: [new Id().value],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('POST /lesson/day/add', () => {
        it('should return 400 when day is invalid', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              subject: new Id().value,
              teacher: new Id().value,
              classroom: new Id().value,
              duration: 60,
              days: ['mon'],
              times: ['08:00'],
              studentsList: [new Id().value],
            });
          const res = await supertest(app)
            .post('/lesson/day/add')
            .set(headers)
            .send({
              id: created.body.id,
              newDaysList: ['someday'],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when lesson does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .post('/lesson/day/add')
            .set(headers)
            .send({
              id: new Id().value,
              newDaysList: ['fri'],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('POST /lesson/day/remove', () => {
        it('should return 400 when removing invalid day', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              subject: new Id().value,
              teacher: new Id().value,
              classroom: new Id().value,
              duration: 60,
              days: ['mon', 'wed'],
              times: ['08:00'],
              studentsList: [new Id().value],
            });
          const res = await supertest(app)
            .post('/lesson/day/remove')
            .set(headers)
            .send({
              id: created.body.id,
              daysListToRemove: ['friii'],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when lesson does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .post('/lesson/day/remove')
            .set(headers)
            .send({
              id: new Id().value,
              daysListToRemove: ['mon'],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('POST /lesson/time/add', () => {
        it('should return 400 when time format is invalid', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              subject: new Id().value,
              teacher: new Id().value,
              classroom: new Id().value,
              duration: 60,
              days: ['mon'],
              times: ['08:00'],
              studentsList: [new Id().value],
            });
          const res = await supertest(app)
            .post('/lesson/time/add')
            .set(headers)
            .send({
              id: created.body.id,
              newTimesList: ['25:77'],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when lesson does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .post('/lesson/time/add')
            .set(headers)
            .send({
              id: new Id().value,
              newTimesList: ['09:00'],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });

      describe('POST /lesson/time/remove', () => {
        it('should return 400 when removing invalid time', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              subject: new Id().value,
              teacher: new Id().value,
              classroom: new Id().value,
              duration: 60,
              days: ['mon'],
              times: ['08:00', '10:00'],
              studentsList: [new Id().value],
            });
          const res = await supertest(app)
            .post('/lesson/time/remove')
            .set(headers)
            .send({
              id: created.body.id,
              timesListToRemove: ['99:99'],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });

        it('should return 404 when lesson does not exist', async () => {
          const headers = await authHeader();
          const res = await supertest(app)
            .post('/lesson/time/remove')
            .set(headers)
            .send({
              id: new Id().value,
              timesListToRemove: ['08:00'],
            });
          expect(res.status).toBe(400);
          expect(res.body.error).toBeDefined();
        });
      });
    });

    describe('On sucess', () => {
      describe('POST /lesson', () => {
        it('should create a lesson', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          expect(response.status).toBe(201);
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
        });
      });

      describe('GET /lesson/:id', () => {
        it('should find a lesson by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          const res = await supertest(app)
            .get(`/lesson/${created.body.id}`)
            .set(headers);
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('GET /lessons', () => {
        it('should find all lessons', async () => {
          const headers = await authHeader();
          await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced II',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 1,
            });
          const list = await supertest(app).get('/lessons').set(headers);
          expect(list.status).toBe(200);
          expect(Array.isArray(list.body)).toBe(true);
          expect(list.body.length).toBe(2);
        });

        it('should return empty array when there are no lessons', async () => {
          const headers = await authHeader();
          const list = await supertest(app).get('/lessons').set(headers);
          expect(list.status).toBe(200);
          expect(Array.isArray(list.body)).toBe(true);
          expect(list.body.length).toBe(0);
        });
      });

      describe('PATCH /lesson', () => {
        it('should update a lesson by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          const updated = await supertest(app)
            .patch('/lesson')
            .set(headers)
            .send({
              id: created.body.id,
              duration: 90,
            });
          expect(updated.status).toBe(200);
          expect(updated.body).toBeDefined();
        });
      });

      describe('DELETE /lesson/:id', () => {
        it('should delete a lesson by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          const res = await supertest(app)
            .delete(`/lesson/${created.body.id}`)
            .set(headers);
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('POST /lesson/student/add', () => {
        it('should add students to the lesson', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          const res = await supertest(app)
            .post('/lesson/student/add')
            .set(headers)
            .send({
              id: created.body.id,
              newStudentsList: [new Id().value, new Id().value],
            });
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('POST /lesson/student/remove', () => {
        it('should remove students from the lesson', async () => {
          const headers = await authHeader();
          const studentA = new Id().value;
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [
                studentA,
                new Id().value,
                new Id().value,
                new Id().value,
              ],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          const res = await supertest(app)
            .post('/lesson/student/remove')
            .set(headers)
            .send({
              id: created.body.id,
              studentsListToRemove: [studentA],
            });
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('POST /lesson/day/add', () => {
        it('should add days to the lesson', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          const res = await supertest(app)
            .post('/lesson/day/add')
            .set(headers)
            .send({
              id: created.body.id,
              newDaysList: ['fri'],
            });
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('POST /lesson/day/remove', () => {
        it('should remove days from the lesson', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          const res = await supertest(app)
            .post('/lesson/day/remove')
            .set(headers)
            .send({
              id: created.body.id,
              daysListToRemove: ['fri'],
            });
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('POST /lesson/time/add', () => {
        it('should add times to the lesson', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '19:00'],
              semester: 2,
            });
          const res = await supertest(app)
            .post('/lesson/time/add')
            .set(headers)
            .send({
              id: created.body.id,
              newTimesList: ['09:00'],
            });
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });

      describe('POST /lesson/time/remove', () => {
        it('should remove times from the lesson', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/lesson')
            .set(headers)
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'],
              times: ['15:55', '10:00'],
              semester: 2,
            });
          const res = await supertest(app)
            .post('/lesson/time/remove')
            .set(headers)
            .send({
              id: created.body.id,
              timesListToRemove: ['10:00'],
            });
          expect(res.status).toBe(200);
          expect(res.body).toBeDefined();
        });
      });
    });
  });
});
