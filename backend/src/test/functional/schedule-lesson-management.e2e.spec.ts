import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import MemoryScheduleRepository from '@/modules/schedule-lesson-management/infrastructure/repositories/memory-repository/schedule.repository';
import MemoryLessonRepository from '@/modules/schedule-lesson-management/infrastructure/repositories/memory-repository/lesson.repository';
import CreateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/create.usecase';
import FindSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/find.usecase';
import FindAllSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/find-all.usecase';
import UpdateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/update.usecase';
import DeleteSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/delete.usecase';
import AddLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/add-lessons.usecase';
import RemoveLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/remove-lessons.usecase';
import CreateLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/create.usecase';
import FindLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/find.usecase';
import FindAllLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/find-all.usecase';
import UpdateLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/update.usecase';
import DeleteLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/delete.usecase';
import AddStudents from '@/modules/schedule-lesson-management/application/usecases/lesson/add-students.usecase';
import RemoveStudents from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-students.usecase';
import AddDay from '@/modules/schedule-lesson-management/application/usecases/lesson/add-day.usecase';
import RemoveDay from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-day.usecase';
import AddTime from '@/modules/schedule-lesson-management/application/usecases/lesson/add-time.usecase';
import RemoveTime from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-time.usecase';
import { ScheduleController } from '@/modules/schedule-lesson-management/interface/controller/schedule.controller';
import { LessonController } from '@/modules/schedule-lesson-management/interface/controller/lesson.controller';
import { ScheduleRoute } from '@/modules/schedule-lesson-management/interface/route/schedule.route';
import { LessonRoute } from '@/modules/schedule-lesson-management/interface/route/lesson.route';

describe('Schedule lesson management module end to end test', () => {
  let scheduleRepository = new MemoryScheduleRepository();
  let lessonRepository = new MemoryLessonRepository();
  let app: any;
  beforeEach(() => {
    scheduleRepository = new MemoryScheduleRepository();
    lessonRepository = new MemoryLessonRepository();

    const createScheduleUsecase = new CreateSchedule(scheduleRepository);
    const findScheduleUsecase = new FindSchedule(scheduleRepository);
    const findAllScheduleUsecase = new FindAllSchedule(scheduleRepository);
    const updateScheduleUsecase = new UpdateSchedule(scheduleRepository);
    const deleteScheduleUsecase = new DeleteSchedule(scheduleRepository);
    const addLessons = new AddLessons(scheduleRepository);
    const removeLessons = new RemoveLessons(scheduleRepository);

    const createLessonUsecase = new CreateLesson(lessonRepository);
    const findLessonUsecase = new FindLesson(lessonRepository);
    const findAllLessonUsecase = new FindAllLesson(lessonRepository);
    const updateLessonUsecase = new UpdateLesson(lessonRepository);
    const deleteLessonUsecase = new DeleteLesson(lessonRepository);
    const addStudents = new AddStudents(lessonRepository);
    const removeStudents = new RemoveStudents(lessonRepository);
    const addDay = new AddDay(lessonRepository);
    const removeDay = new RemoveDay(lessonRepository);
    const addTime = new AddTime(lessonRepository);
    const removeTime = new RemoveTime(lessonRepository);

    const scheduleController = new ScheduleController(
      createScheduleUsecase,
      findScheduleUsecase,
      findAllScheduleUsecase,
      updateScheduleUsecase,
      deleteScheduleUsecase,
      addLessons,
      removeLessons
    );
    const lessonController = new LessonController(
      createLessonUsecase,
      findLessonUsecase,
      findAllLessonUsecase,
      updateLessonUsecase,
      deleteLessonUsecase,
      addStudents,
      removeStudents,
      addDay,
      removeDay,
      addTime,
      removeTime
    );

    const expressHttp = new ExpressHttp();
    const tokerService = tokenInstance();

    const authUserMiddlewareSchedule = new AuthUserMiddleware(tokerService, [
      'master',
      'administrator',
    ]);
    const authUserMiddlewareLesson = new AuthUserMiddleware(tokerService, [
      'master',
      'administrator',
    ]);

    const scheduleRoute = new ScheduleRoute(
      scheduleController,
      expressHttp,
      authUserMiddlewareSchedule
    );
    const lessonRoute = new LessonRoute(
      lessonController,
      expressHttp,
      authUserMiddlewareLesson
    );

    scheduleRoute.routes();
    lessonRoute.routes();
    app = expressHttp.getExpressInstance();
  });

  describe('Schedule', () => {
    describe('On error', () => {
      describe('POST /schedule', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: '123',
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /schedule/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          const schedule = await supertest(app)
            .get(`/schedule/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(schedule.status).toBe(400);
          expect(schedule.body.error).toBeDefined();
        });
      });
      describe('PATCH /schedule/:id', () => {
        it('should throw an error when the data to update a schedule is wrong', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          const id = response.body.id;
          const updatedSchedule = await supertest(app)
            .patch(`/schedule/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              curriculum: 24,
            });
          expect(updatedSchedule.status).toBe(400);
          expect(updatedSchedule.body.error).toBeDefined();
        });
      });
      describe('DELETE /schedule/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          const result = await supertest(app)
            .delete(`/schedule/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /schedule/add', () => {
        it('should add lessons to the schedule', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/schedule/add')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              newLessonsList: [123],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /schedule/remove', () => {
        it('should remove lessons from the schedule', async () => {
          const input = {
            student: new Id().value,
            curriculum: new Id().value,
            lessonsList: [new Id().value, new Id().value, new Id().value],
          };
          await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const result = await supertest(app)
            .post('/schedule/remove')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: '123',
              schedulesListToRemove: [input.lessonsList[0]],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /schedule', () => {
        it('should create a user', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /schedule/:id', () => {
        it('should find a user by ID', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          const id = response.body.id;
          const schedule = await supertest(app)
            .get(`/schedule/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(schedule.status).toBe(200);
          expect(schedule.body).toBeDefined();
        });
      });
      describe('GET /schedules/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          const response = await supertest(app)
            .get('/schedules')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /schedule/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          const id = response.body.id;
          const updatedSchedule = await supertest(app)
            .patch(`/schedule/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          expect(updatedSchedule.status).toBe(200);
          expect(updatedSchedule.body).toBeDefined();
        });
      });
      describe('DELETE /schedule/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          const id = response.body.id;
          const result = await supertest(app)
            .delete(`/schedule/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
      describe('POST /schedule/add', () => {
        it('should add lessons to the schedule', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              student: new Id().value,
              curriculum: new Id().value,
              lessonsList: [new Id().value, new Id().value, new Id().value],
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/schedule/add')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              newLessonsList: [new Id().value],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined();
        });
      });
      describe('POST /schedule/remove', () => {
        it('should remove lessons from the schedule', async () => {
          const input = {
            student: new Id().value,
            curriculum: new Id().value,
            lessonsList: [new Id().value, new Id().value, new Id().value],
          };
          const response = await supertest(app)
            .post('/schedule')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const id = response.body.id;
          const result = await supertest(app)
            .post('/schedule/remove')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              lessonsListToRemove: [input.lessonsList[0]],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined();
        });
      });
    });
  });
  describe('Lesson', () => {
    describe('On error', () => {
      describe('POST /lesson', () => {
        it('should throw an error when the data to create a lesson is wrong', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /lesson/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const lesson = await supertest(app)
            .get(`/lesson/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(lesson.status).toBe(400);
          expect(lesson.body.error).toBeDefined();
        });
      });
      describe('PATCH /lesson/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const updatedLesson = await supertest(app)
            .patch(`/lesson/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: -60,
            });
          expect(updatedLesson.status).toBe(400);
          expect(updatedLesson.body.error).toBeDefined();
        });
      });
      describe('DELETE /lesson/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const result = await supertest(app)
            .delete(`/lesson/123`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /lesson/add/students', () => {
        it('should throw an error when the schedule`ID is incorrect', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/students')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              newStudentsList: ['invalidId'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /lesson/remove/students', () => {
        it('should throw an error when the ID is incorrect', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().value,
            studentsList: [new Id().value, new Id().value, new Id().value],
            subject: new Id().value,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const result = await supertest(app)
            .post('/lesson/remove/students')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: new Id().value,
              schedulesListToRemove: [input.studentsList[0]],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /lesson/add/day', () => {
        it('should throw an error when the day is incorrect', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/day')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              newDayList: ['sunday'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /lesson/remove/day', () => {
        it('should throw an error when the day is not in lesson', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().value,
            studentsList: [new Id().value, new Id().value, new Id().value],
            subject: new Id().value,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const result = await supertest(app)
            .post('/lesson/remove/day')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: new Id().value,
              dayListToRemove: ['tue'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /lesson/add/time', () => {
        it('should throw an error when the time format is incorrect', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/time')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              newTimeList: ['24:00'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /lesson/remove/time', () => {
        it('should throw an error when the ID is incorrect', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().value,
            studentsList: [new Id().value, new Id().value, new Id().value],
            subject: new Id().value,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const result = await supertest(app)
            .post('/lesson/remove/time')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: new Id().value,
              newTimeList: ['22:00'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /lesson', () => {
        it('should create a lesson', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /lesson/:id', () => {
        it('should find a lesson by ID', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const lesson = await supertest(app)
            .get(`/lesson/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(lesson.status).toBe(200);
          expect(lesson.body).toBeDefined();
        });
      });
      describe('GET /lessons/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const response = await supertest(app)
            .get('/lessons')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /lesson/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const updatedLesson = await supertest(app)
            .patch(`/lesson/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              duration: 75,
            });
          expect(updatedLesson.status).toBe(200);
          expect(updatedLesson.body).toBeDefined();
        });
      });
      describe('DELETE /lesson/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .delete(`/lesson/${id}`)
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
      describe('POST /lesson/add/students', () => {
        it('should add students to the lesson', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/students')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              newStudentsList: [new Id().value],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined();
        });
      });
      describe('POST /lesson/remove/students', () => {
        it('should remove students from the lesson', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().value,
            studentsList: [new Id().value, new Id().value, new Id().value],
            subject: new Id().value,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/remove/students')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              studentsListToRemove: [input.studentsList[0]],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined();
        });
      });
      describe('POST /lesson/add/day', () => {
        it('should add day to the lesson', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/day')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              newDaysList: ['tue'],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined();
        });
      });
      describe('POST /lesson/remove/day', () => {
        it('should remove students from the lesson', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().value,
            studentsList: [new Id().value, new Id().value, new Id().value],
            subject: new Id().value,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          const id = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const result = await supertest(app)
            .post('/lesson/remove/day')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id.body.id,
              daysListToRemove: ['mon'],
            });
          expect(result.status).toBe(201);
          expect(result.body.message).toBeDefined();
        });
      });
      describe('POST /lesson/add/time', () => {
        it('should add time to the lesson', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().value,
              studentsList: [new Id().value, new Id().value, new Id().value],
              subject: new Id().value,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/time')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              newTimesList: ['07:00'],
            });
          expect(result.status).toBe(201);
          expect(result.body.message).toBeDefined();
        });
      });
      describe('POST /lesson/remove/time', () => {
        it('should remove time from the Lesson', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().value,
            studentsList: [new Id().value, new Id().value, new Id().value],
            subject: new Id().value,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          const response = await supertest(app)
            .post('/lesson')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/remove/time')
            .set(
              'authorization',
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              id: id,
              timesListToRemove: ['15:55'],
            });
          expect(result.status).toBe(201);
          expect(result.body.message).toBeDefined();
        });
      });
    });
  });
});
