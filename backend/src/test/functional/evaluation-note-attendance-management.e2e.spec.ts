import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import MemoryEvaluationRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/evaluation.repository';
import MemoryNoteRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/note.repository';
import MemoryAttendanceRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/attendance.repository';
import CreateEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/create.usecase';
import FindEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/find.usecase';
import FindAllEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/find-all.usecase';
import UpdateEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/update.usecase';
import DeleteEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/delete.usecase';
import EvaluationController from '@/modules/evaluation-note-attendance-management/interface/controller/evaluation.controller';
import EvaluationRoute from '@/modules/evaluation-note-attendance-management/interface/route/evaluation.route';
import CreateNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/create.usecase';
import FindNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/find.usecase';
import FindAllNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/find-all.usecase';
import UpdateNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/update.usecase';
import DeleteNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/delete.usecase';
import NoteController from '@/modules/evaluation-note-attendance-management/interface/controller/note.controller';
import NoteRoute from '@/modules/evaluation-note-attendance-management/interface/route/note.route';
import CreateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/create.usecase';
import FindAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/find.usecase';
import FindAllAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/find-all.usecase';
import UpdateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/update.usecase';
import DeleteAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/delete.usecase';
import AddStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/add-students.usecase';
import RemoveStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/remove-students.usecase';
import AttendanceController from '@/modules/evaluation-note-attendance-management/interface/controller/attendance.controller';
import AttendanceRoute from '@/modules/evaluation-note-attendance-management/interface/route/attendance.route';

let tokenService: TokenService;

async function makeToken(): Promise<string> {
  const authService = new AuthUserService();
  const authUser = new AuthUser(
    {
      email: 'testsuite@example.com',
      password: 'StrongPass1!',
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

describe('Evaluation note attendance management module end to end test', () => {
  let evaluationRepository: MemoryEvaluationRepository;
  let noteRepository: MemoryNoteRepository;
  let attendanceRepository: MemoryAttendanceRepository;
  let app: any;

  beforeEach(() => {
    evaluationRepository = new MemoryEvaluationRepository();
    noteRepository = new MemoryNoteRepository();
    attendanceRepository = new MemoryAttendanceRepository();
    const policiesService = new PoliciesService();

    tokenService = new TokenService('e2e-secret');

    const createEvaluationUsecase = new CreateEvaluation(
      evaluationRepository,
      policiesService
    );
    const findEvaluationUsecase = new FindEvaluation(
      evaluationRepository,
      policiesService
    );
    const findAllEvaluationUsecase = new FindAllEvaluation(
      evaluationRepository,
      policiesService
    );
    const updateEvaluationUsecase = new UpdateEvaluation(
      evaluationRepository,
      policiesService
    );
    const deleteEvaluationUsecase = new DeleteEvaluation(
      evaluationRepository,
      policiesService
    );

    const evaluationController = new EvaluationController(
      createEvaluationUsecase,
      findEvaluationUsecase,
      findAllEvaluationUsecase,
      updateEvaluationUsecase,
      deleteEvaluationUsecase
    );

    const createNoteUsecase = new CreateNote(noteRepository, policiesService);
    const findNoteUsecase = new FindNote(noteRepository, policiesService);
    const findAllNoteUsecase = new FindAllNote(noteRepository, policiesService);
    const updateNoteUsecase = new UpdateNote(noteRepository, policiesService);
    const deleteNoteUsecase = new DeleteNote(noteRepository, policiesService);

    const noteController = new NoteController(
      createNoteUsecase,
      findNoteUsecase,
      findAllNoteUsecase,
      updateNoteUsecase,
      deleteNoteUsecase
    );

    const createAttendanceUsecase = new CreateAttendance(
      attendanceRepository,
      policiesService
    );
    const findAttendanceUsecase = new FindAttendance(
      attendanceRepository,
      policiesService
    );
    const findAllAttendanceUsecase = new FindAllAttendance(
      attendanceRepository,
      policiesService
    );
    const updateAttendanceUsecase = new UpdateAttendance(
      attendanceRepository,
      policiesService
    );
    const deleteAttendanceUsecase = new DeleteAttendance(
      attendanceRepository,
      policiesService
    );
    const addStudentsUsecase = new AddStudents(attendanceRepository, policiesService);
    const removeStudentsUsecase = new RemoveStudents(
      attendanceRepository,
      policiesService
    );

    const attendanceController = new AttendanceController(
      createAttendanceUsecase,
      findAttendanceUsecase,
      findAllAttendanceUsecase,
      updateAttendanceUsecase,
      deleteAttendanceUsecase,
      addStudentsUsecase,
      removeStudentsUsecase
    );

    const expressHttp = new ExpressAdapter();
    const authMiddlewareEvaluation = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
      RoleUsersEnum.WORKER,
    ]);
    const authMiddlewareNote = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
      RoleUsersEnum.WORKER,
    ]);
    const authMiddlewareAttendance = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
      RoleUsersEnum.WORKER,
    ]);

    new EvaluationRoute(
      evaluationController,
      expressHttp,
      authMiddlewareEvaluation
    ).routes();
    new NoteRoute(noteController, expressHttp, authMiddlewareNote).routes();
    new AttendanceRoute(
      attendanceController,
      expressHttp,
      authMiddlewareAttendance
    ).routes();

    app = expressHttp.getNativeServer();
  });
  describe('Evaluation', () => {
    describe('On error', () => {
      describe('POST /evaluation', () => {
        it('should throw an error when the data to create an evaluation is wrong', async () => {
          const headers = await authHeader();
          const response = await supertest(app).post('/evaluation').set(headers).send({
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
          });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
          expect(response.body.details).toBeDefined();
        });
      });

      describe('GET /evaluation/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/evaluation/123').set(headers);
          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
          expect(response.body.details).toBeDefined();
        });

        it('should return 404 when evaluation does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/evaluation/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
          expect(response.body.details).toBeDefined();
        });
      });

      describe('PATCH /evaluation', () => {
        it('should throw an error when the data to update an evaluation is wrong', async () => {
          const headers = await authHeader();

          const created = await supertest(app).post('/evaluation').set(headers).send({
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
            value: 10,
          });

          const response = await supertest(app).patch('/evaluation').set(headers).send({
            id: created.body.id,
            lesson: 123,
            teacher: new Id().value,
            type: 'evaluation',
          });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to update a non-existent evaluation', async () => {
          const headers = await authHeader();
          const response = await supertest(app).patch('/evaluation').set(headers).send({
            id: new Id().value,
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
            value: 7,
          });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('DELETE /evaluation/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).delete('/evaluation/123').set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to delete a non-existent evaluation', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .delete(`/evaluation/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('MIDDLEWARE /evaluation', () => {
        it('should return 401 when authorization header is missing', async () => {
          const response = await supertest(app).get('/evaluations');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid', async () => {
          const response = await supertest(app)
            .get('/evaluations')
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });

    describe('On sucess', () => {
      describe('POST /evaluation', () => {
        it('should create an evaluation', async () => {
          const headers = await authHeader();
          const response = await supertest(app).post('/evaluation').set(headers).send({
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
            value: 10,
          });

          expect(response.status).toBe(201);
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
        });
      });

      describe('GET /evaluation/:id', () => {
        it('should find an evaluation by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/evaluation').set(headers).send({
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
            value: 10,
          });

          const response = await supertest(app)
            .get(`/evaluation/${created.body.id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('GET /evaluations', () => {
        it('should find all evaluations', async () => {
          const headers = await authHeader();

          await supertest(app).post('/evaluation').set(headers).send({
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
            value: 10,
          });
          await supertest(app).post('/evaluation').set(headers).send({
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
            value: 9,
          });

          const response = await supertest(app).get('/evaluations').set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });

      describe('PATCH /evaluation', () => {
        it('should update an evaluation by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/evaluation').set(headers).send({
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
            value: 6,
          });

          const response = await supertest(app).patch('/evaluation').set(headers).send({
            id: created.body.id,
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
            value: 8,
          });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('DELETE /evaluation/:id', () => {
        it('should delete an evaluation by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/evaluation').set(headers).send({
            lesson: new Id().value,
            teacher: new Id().value,
            type: 'evaluation',
            value: 10,
          });

          const response = await supertest(app)
            .delete(`/evaluation/${created.body.id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
    });
  });
  describe('Note', () => {
    describe('On error', () => {
      describe('POST /note', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          const headers = await authHeader();
          const response = await supertest(app).post('/note').set(headers).send({
            evaluation: new Id().value,
            note: 10,
          });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
          expect(response.body.details).toBeDefined();
        });
      });

      describe('GET /note/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/note/123').set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
          expect(response.body.details).toBeDefined();
        });

        it('should return 404 when note does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/note/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
          expect(response.body.details).toBeDefined();
        });
      });

      describe('PATCH /note', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/note').set(headers).send({
            evaluation: new Id().value,
            student: new Id().value,
            note: 7,
          });

          const response = await supertest(app).patch('/note').set(headers).send({
            id: created.body.id,
          });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to update a non-existent note', async () => {
          const headers = await authHeader();
          const response = await supertest(app).patch('/note').set(headers).send({
            id: new Id().value,
            note: 6,
          });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('DELETE /note/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).delete('/note/123').set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to delete a non-existent note', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .delete(`/note/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('MIDDLEWARE /note', () => {
        it('should return 401 when authorization header is missing', async () => {
          const response = await supertest(app).get('/notes');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid', async () => {
          const response = await supertest(app)
            .get('/notes')
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });

    describe('On sucess', () => {
      describe('POST /note', () => {
        it('should create a user', async () => {
          const headers = await authHeader();
          const response = await supertest(app).post('/note').set(headers).send({
            evaluation: new Id().value,
            student: new Id().value,
            note: 10,
          });

          expect(response.status).toBe(201);
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
        });
      });

      describe('GET /note/:id', () => {
        it('should find a user by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/note').set(headers).send({
            evaluation: new Id().value,
            student: new Id().value,
            note: 9,
          });

          const response = await supertest(app)
            .get(`/note/${created.body.id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('GET /notes', () => {
        it('should find all users', async () => {
          const headers = await authHeader();

          await supertest(app).post('/note').set(headers).send({
            evaluation: new Id().value,
            student: new Id().value,
            note: 8,
          });
          await supertest(app).post('/note').set(headers).send({
            evaluation: new Id().value,
            student: new Id().value,
            note: 7,
          });

          const response = await supertest(app).get('/notes').set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });

      describe('PATCH /note', () => {
        it('should update a user by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/note').set(headers).send({
            evaluation: new Id().value,
            student: new Id().value,
            note: 5,
          });

          const response = await supertest(app).patch('/note').set(headers).send({
            id: created.body.id,
            note: 6,
          });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('DELETE /note/:id', () => {
        it('should delete a user by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/note').set(headers).send({
            evaluation: new Id().value,
            student: new Id().value,
            note: 10,
          });

          const result = await supertest(app)
            .delete(`/note/${created.body.id}`)
            .set(headers);

          expect(result.status).toBe(200);
          expect(result.body).toBeDefined();
        });
      });
    });
  });
  describe('Attendance', () => {
    describe('On error', () => {
      describe('POST /attendance', () => {
        it('should throw an error when the data to create an attendance is wrong', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              lesson: new Id().value,
              date: 'invalid',
              hour: '06:50',
              day: 'fri',
              studentsPresent: [new Id().value],
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('GET /attendance/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/attendance/123').set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when attendance does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/attendance/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('PATCH /attendance', () => {
        it('should throw an error when the data to update an attendance is wrong', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              date: new Date(),
              hour: '06:50',
              day: 'fri',
              studentsPresent: [new Id().value],
            });

          const response = await supertest(app).patch('/attendance').set(headers).send({
            id: created.body.id,
          });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to update a non-existent attendance', async () => {
          const headers = await authHeader();
          const response = await supertest(app).patch('/attendance').set(headers).send({
            id: new Id().value,
            hour: '08:00',
          });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('DELETE /attendance/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).delete('/attendance/123').set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to delete a non-existent attendance', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .delete(`/attendance/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('POST /attendance/add/students', () => {
        it('should return 404 when attendance does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/attendance/add/students')
            .set(headers)
            .send({
              id: new Id().value,
              newStudentsList: [new Id().value],
            });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('POST /attendance/remove/students', () => {
        it('should return 404 when attendance does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/attendance/remove/students')
            .set(headers)
            .send({
              id: new Id().value,
              studentsListToRemove: [new Id().value],
            });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('MIDDLEWARE /attendance', () => {
        it('should return 401 when authorization header is missing', async () => {
          const response = await supertest(app).get('/attendances');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid', async () => {
          const response = await supertest(app)
            .get('/attendances')
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });

    describe('On sucess', () => {
      describe('POST /attendance', () => {
        it('should create an attendance', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              date: new Date(),
              day: 'fri',
              hour: '06:50',
              lesson: new Id().value,
              studentsPresent: [new Id().value, new Id().value],
            });

          expect(response.status).toBe(201);
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
        });
      });

      describe('GET /attendance/:id', () => {
        it('should find an attendance by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              date: new Date(),
              day: 'fri',
              hour: '06:50',
              lesson: new Id().value,
              studentsPresent: [new Id().value],
            });

          const response = await supertest(app)
            .get(`/attendance/${created.body.id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('GET /attendances', () => {
        it('should find all attendances', async () => {
          const headers = await authHeader();

          await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              date: new Date(),
              day: 'fri',
              hour: '06:50',
              lesson: new Id().value,
              studentsPresent: [new Id().value],
            });
          await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              date: new Date(),
              day: 'fri',
              hour: '06:50',
              lesson: new Id().value,
              studentsPresent: [new Id().value],
            });

          const response = await supertest(app).get('/attendances').set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });

      describe('PATCH /attendance', () => {
        it('should update an attendance', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              date: new Date(),
              day: 'fri',
              hour: '06:50',
              lesson: new Id().value,
              studentsPresent: [new Id().value],
            });

          const response = await supertest(app).patch('/attendance').set(headers).send({
            id: created.body.id,
            hour: '08:00',
          });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('DELETE /attendance/:id', () => {
        it('should delete an attendance by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              date: new Date(),
              day: 'fri',
              hour: '06:50',
              lesson: new Id().value,
              studentsPresent: [new Id().value],
            });

          const response = await supertest(app)
            .delete(`/attendance/${created.body.id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('POST /attendance/add/students', () => {
        it('should add students to the attendance', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              date: new Date(),
              day: 'fri',
              hour: '06:50',
              lesson: new Id().value,
              studentsPresent: [new Id().value],
            });

          const response = await supertest(app)
            .post('/attendance/add/students')
            .set(headers)
            .send({
              id: created.body.id,
              newStudentsList: [new Id().value],
            });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('POST /attendance/remove/students', () => {
        it('should remove students from the attendance', async () => {
          const headers = await authHeader();
          const studentA = new Id().value;
          const created = await supertest(app)
            .post('/attendance')
            .set(headers)
            .send({
              date: new Date(),
              day: 'fri',
              hour: '06:50',
              lesson: new Id().value,
              studentsPresent: [new Id().value, studentA],
            });

          const response = await supertest(app)
            .post('/attendance/remove/students')
            .set(headers)
            .send({
              id: created.body.id,
              studentsListToRemove: [studentA],
            });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
    });
  });
});
