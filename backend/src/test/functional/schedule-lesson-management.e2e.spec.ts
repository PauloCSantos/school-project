import AddDay from '@/application/usecases/schedule-lesson-management/lesson/addDay.usecase';
import AddStudents from '@/application/usecases/schedule-lesson-management/lesson/addStudents.usecase';
import AddTime from '@/application/usecases/schedule-lesson-management/lesson/addTime.usecase';
import CreateLesson from '@/application/usecases/schedule-lesson-management/lesson/createLesson.usecase';
import DeleteLesson from '@/application/usecases/schedule-lesson-management/lesson/deleteLesson.usecase';
import FindAllLesson from '@/application/usecases/schedule-lesson-management/lesson/findAllLesson.usecase';
import FindLesson from '@/application/usecases/schedule-lesson-management/lesson/findLesson.usecase';
import RemoveDay from '@/application/usecases/schedule-lesson-management/lesson/removeDay.usecase';
import RemoveStudents from '@/application/usecases/schedule-lesson-management/lesson/removeStudents.usecase';
import RemoveTime from '@/application/usecases/schedule-lesson-management/lesson/removeTime.usecase';
import UpdateLesson from '@/application/usecases/schedule-lesson-management/lesson/updateLesson.usecase';
import AddLessons from '@/application/usecases/schedule-lesson-management/schedule/addLessons.usecase';
import CreateSchedule from '@/application/usecases/schedule-lesson-management/schedule/createSchedule.usecase';
import DeleteSchedule from '@/application/usecases/schedule-lesson-management/schedule/deleteSchedule.usecase';
import FindAllSchedule from '@/application/usecases/schedule-lesson-management/schedule/findAllSchedule.usecase';
import FindSchedule from '@/application/usecases/schedule-lesson-management/schedule/findSchedule.usecase';
import RemoveLessons from '@/application/usecases/schedule-lesson-management/schedule/removeLessons.usecase';
import UpdateSchedule from '@/application/usecases/schedule-lesson-management/schedule/updateSchedule.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryLessonRepository from '@/infraestructure/repositories/schedule-lesson-management/memory-repository/lesson.repository';
import MemoryScheduleRepository from '@/infraestructure/repositories/schedule-lesson-management/memory-repository/schedule.repository';
import { LessonController } from '@/interface/controller/schedule-lesson-management/lesson.controller';
import { ScheduleController } from '@/interface/controller/schedule-lesson-management/schedule.controller';
import { LessonRoute } from '@/interface/route/schedule-lesson-management/lesson.route';
import { ScheduleRoute } from '@/interface/route/schedule-lesson-management/schedule.route';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';

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

    const scheduleRoute = new ScheduleRoute(scheduleController, expressHttp);
    const lessonRoute = new LessonRoute(lessonController, expressHttp);

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
            .send({
              student: '123',
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /schedule/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          const schedule = await supertest(app).get(`/schedule/123`);
          expect(schedule.status).toBe(200);
          expect(schedule.body).toBe('');
        });
      });
      describe('PATCH /schedule/:id', () => {
        it('should throw an error when the data to update a schedule is wrong', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const updatedSchedule = await supertest(app)
            .patch(`/schedule/${id}`)
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
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          const result = await supertest(app).delete(`/schedule/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /schedule/add', () => {
        it('should add lessons to the schedule', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/schedule/add')
            .send({
              id: id,
              newLessonsList: [123],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /schedule/remove', () => {
        it('should remove lessons from the schedule', async () => {
          const input = {
            student: new Id().id,
            curriculum: new Id().id,
            lessonsList: [new Id().id, new Id().id, new Id().id],
          };
          await supertest(app).post('/schedule').send(input);
          const result = await supertest(app)
            .post('/schedule/remove')
            .send({
              id: '123',
              schedulesListToRemove: [input.lessonsList[0]],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /schedule', () => {
        it('should create a user', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /schedule/:id', () => {
        it('should find a user by ID', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const schedule = await supertest(app).get(`/schedule/${id}`);
          expect(schedule.status).toBe(200);
          expect(schedule.body).toBeDefined();
        });
      });
      describe('GET /schedule/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          const response = await supertest(app).get('/schedule');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /schedule/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const updatedSchedule = await supertest(app)
            .patch(`/schedule/${id}`)
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          expect(updatedSchedule.status).toBe(200);
          expect(updatedSchedule.body).toBeDefined();
        });
      });
      describe('DELETE /schedule/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const result = await supertest(app).delete(`/schedule/${id}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
      describe('POST /schedule/add', () => {
        it('should add lessons to the schedule', async () => {
          const response = await supertest(app)
            .post('/schedule')
            .send({
              student: new Id().id,
              curriculum: new Id().id,
              lessonsList: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/schedule/add')
            .send({
              id: id,
              newLessonsList: [new Id().id],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined;
        });
      });
      describe('POST /schedule/remove', () => {
        it('should remove lessons from the schedule', async () => {
          const input = {
            student: new Id().id,
            curriculum: new Id().id,
            lessonsList: [new Id().id, new Id().id, new Id().id],
          };
          const response = await supertest(app).post('/schedule').send(input);
          const id = response.body.id;
          const result = await supertest(app)
            .post('/schedule/remove')
            .send({
              id: id,
              lessonsListToRemove: [input.lessonsList[0]],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined;
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
            .send({
              name: 'Math advanced I',
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
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
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const lesson = await supertest(app).get(`/lesson/123`);
          expect(lesson.status).toBe(200);
          expect(lesson.body).toBe('');
        });
      });
      describe('PATCH /lesson/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const updatedLesson = await supertest(app)
            .patch(`/lesson/${id}`)
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
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const result = await supertest(app).delete(`/lesson/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /lesson/add/students', () => {
        it('should throw an error when the schedule`ID is incorrect', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/students')
            .send({
              id: id,
              newStudentsList: ['invalidId'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /lesson/remove/students', () => {
        it('should throw an error when the ID is incorrect', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().id,
            studentsList: [new Id().id, new Id().id, new Id().id],
            subject: new Id().id,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          await supertest(app).post('/lesson').send(input);
          const result = await supertest(app)
            .post('/lesson/remove/students')
            .send({
              id: new Id().id,
              schedulesListToRemove: [input.studentsList[0]],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /lesson/add/day', () => {
        it('should throw an error when the day is incorrect', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/day')
            .send({
              id: id,
              newDayList: ['sunday'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /lesson/remove/day', () => {
        it('should throw an error when the day is not in lesson', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().id,
            studentsList: [new Id().id, new Id().id, new Id().id],
            subject: new Id().id,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          await supertest(app).post('/lesson').send(input);
          const result = await supertest(app)
            .post('/lesson/remove/day')
            .send({
              id: new Id().id,
              dayListToRemove: ['tue'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /lesson/add/time', () => {
        it('should throw an error when the time format is incorrect', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/time')
            .send({
              id: id,
              newTimeList: ['24:00'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /lesson/remove/time', () => {
        it('should throw an error when the ID is incorrect', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().id,
            studentsList: [new Id().id, new Id().id, new Id().id],
            subject: new Id().id,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          await supertest(app).post('/lesson').send(input);
          const result = await supertest(app)
            .post('/lesson/remove')
            .send({
              id: new Id().id,
              newTimeList: ['22:00'],
            });
          expect(result.status).toBe(404);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /lesson', () => {
        it('should create a lesson', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
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
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const lesson = await supertest(app).get(`/lesson/${id}`);
          expect(lesson.status).toBe(200);
          expect(lesson.body).toBeDefined();
        });
      });
      describe('GET /lesson/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const response = await supertest(app).get('/lesson');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /lesson/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const updatedLesson = await supertest(app)
            .patch(`/lesson/${id}`)
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
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app).delete(`/lesson/${id}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
      describe('POST /lesson/add/students', () => {
        it('should add students to the lesson', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/students')
            .send({
              id: id,
              newStudentsList: [new Id().id],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined;
        });
      });
      describe('POST /lesson/remove/students', () => {
        it('should remove students from the lesson', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().id,
            studentsList: [new Id().id, new Id().id, new Id().id],
            subject: new Id().id,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          const response = await supertest(app).post('/lesson').send(input);
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/remove/students')
            .send({
              id: id,
              studentsListToRemove: [input.studentsList[0]],
            });
          expect(result.status).toBe(201);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /lesson/add/day', () => {
        it('should add day to the lesson', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/day')
            .send({
              id: id,
              newDaysList: ['tue'],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined;
        });
      });
      describe('POST /lesson/remove/day', () => {
        it('should remove students from the lesson', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().id,
            studentsList: [new Id().id, new Id().id, new Id().id],
            subject: new Id().id,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          const id = await supertest(app).post('/lesson').send(input);
          const result = await supertest(app)
            .post('/lesson/remove/day')
            .send({
              id: id.body.id,
              daysListToRemove: ['mon'],
            });
          expect(result.status).toBe(201);
          expect(result.body.message).toBeDefined;
        });
      });
      describe('POST /lesson/add/time', () => {
        it('should add time to the lesson', async () => {
          const response = await supertest(app)
            .post('/lesson')
            .send({
              name: 'Math advanced I',
              duration: 60,
              teacher: new Id().id,
              studentsList: [new Id().id, new Id().id, new Id().id],
              subject: new Id().id,
              days: ['mon', 'fri'] as DayOfWeek[],
              times: ['15:55', '19:00'] as Hour[],
              semester: 2 as 1 | 2,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/add/time')
            .send({
              id: id,
              newTimesList: ['07:00'],
            });
          expect(result.status).toBe(201);
          expect(result.body.message).toBeDefined;
        });
      });
      describe('POST /lesson/remove/time', () => {
        it('should remove time from the Lesson', async () => {
          const input = {
            name: 'Math advanced I',
            duration: 60,
            teacher: new Id().id,
            studentsList: [new Id().id, new Id().id, new Id().id],
            subject: new Id().id,
            days: ['mon', 'fri'] as DayOfWeek[],
            times: ['15:55', '19:00'] as Hour[],
            semester: 2 as 1 | 2,
          };
          const response = await supertest(app).post('/lesson').send(input);
          const id = response.body.id;
          const result = await supertest(app)
            .post('/lesson/remove/time')
            .send({
              id: id,
              timesListToRemove: ['15:55'],
            });
          expect(result.status).toBe(201);
          expect(result.body.message).toBeDefined;
        });
      });
    });
  });
});
