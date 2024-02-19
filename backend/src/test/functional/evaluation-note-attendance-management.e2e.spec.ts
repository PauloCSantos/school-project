import AddStudents from '@/application/usecases/evaluation-note-attendance-management/attendance/addStudents.usecase';
import CreateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/createAttendance.usecase';
import DeleteAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/deleteAttendance.usecase';
import FindAllAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAllAttendance.usecase';
import FindAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAttendance.usecase';
import RemoveStudents from '@/application/usecases/evaluation-note-attendance-management/attendance/removeStudents.usecase';
import UpdateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/updateAttendance.usecase';
import CreateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/createEvaluation.usecase';
import DeleteEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/deleteEvaluation.usecase';
import FindAllEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findAllEvaluation.usecase';
import FindEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findEvaluation.usecase';
import UpdateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/updateEvaluation.usecase';
import CreateNote from '@/application/usecases/evaluation-note-attendance-management/note/createNote.usecase';
import DeleteNote from '@/application/usecases/evaluation-note-attendance-management/note/deleteNote.usecase';
import FindAllNote from '@/application/usecases/evaluation-note-attendance-management/note/findAllNote.usecase';
import FindNote from '@/application/usecases/evaluation-note-attendance-management/note/findNote.usecase';
import UpdateNote from '@/application/usecases/evaluation-note-attendance-management/note/updateNote.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryAttendanceRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/attendance.repository';
import MemoryEvaluationRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/evaluation.repository';
import MemoryNoteRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/note.repository';
import { AttendanceController } from '@/interface/controller/evaluation-note-attendance-management/attendance.controller';
import { EvaluationController } from '@/interface/controller/evaluation-note-attendance-management/evaluation.controller';
import { NoteController } from '@/interface/controller/evaluation-note-attendance-management/note.controller';
import { AttendanceRoute } from '@/interface/route/evaluation-note-attendance-management/attendance.route';
import { EvaluationRoute } from '@/interface/route/evaluation-note-attendance-management/evaluation.route';
import { NoteRoute } from '@/interface/route/evaluation-note-attendance-management/note.route';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';

describe('Evaluation note attendance management module end to end test', () => {
  let evaluationRepository: MemoryEvaluationRepository;
  let noteRepository: MemoryNoteRepository;
  let attendanceRepository: MemoryAttendanceRepository;
  let app: any;
  beforeEach(() => {
    evaluationRepository = new MemoryEvaluationRepository();
    noteRepository = new MemoryNoteRepository();
    attendanceRepository = new MemoryAttendanceRepository();

    const createEvaluationUsecase = new CreateEvaluation(evaluationRepository);
    const findEvaluationUsecase = new FindEvaluation(evaluationRepository);
    const findAllEvaluationUsecase = new FindAllEvaluation(
      evaluationRepository
    );
    const updateEvaluationUsecase = new UpdateEvaluation(evaluationRepository);
    const deleteEvaluationUsecase = new DeleteEvaluation(evaluationRepository);

    const createNoteUsecase = new CreateNote(noteRepository);
    const findNoteUsecase = new FindNote(noteRepository);
    const findAllNoteUsecase = new FindAllNote(noteRepository);
    const updateNoteUsecase = new UpdateNote(noteRepository);
    const deleteNoteUsecase = new DeleteNote(noteRepository);

    const createAttendanceUsecase = new CreateAttendance(attendanceRepository);
    const findAttendanceUsecase = new FindAttendance(attendanceRepository);
    const findAllAttendanceUsecase = new FindAllAttendance(
      attendanceRepository
    );
    const updateAttendanceUsecase = new UpdateAttendance(attendanceRepository);
    const deleteAttendanceUsecase = new DeleteAttendance(attendanceRepository);
    const addStudents = new AddStudents(attendanceRepository);
    const removeStudents = new RemoveStudents(attendanceRepository);

    const evaluationController = new EvaluationController(
      createEvaluationUsecase,
      findEvaluationUsecase,
      findAllEvaluationUsecase,
      updateEvaluationUsecase,
      deleteEvaluationUsecase
    );
    const noteController = new NoteController(
      createNoteUsecase,
      findNoteUsecase,
      findAllNoteUsecase,
      updateNoteUsecase,
      deleteNoteUsecase
    );
    const attendanceController = new AttendanceController(
      createAttendanceUsecase,
      findAttendanceUsecase,
      findAllAttendanceUsecase,
      updateAttendanceUsecase,
      deleteAttendanceUsecase,
      addStudents,
      removeStudents
    );

    const expressHttp = new ExpressHttp();

    const evaluationRoute = new EvaluationRoute(
      evaluationController,
      expressHttp
    );
    const noteRoute = new NoteRoute(noteController, expressHttp);
    const attendanceRoute = new AttendanceRoute(
      attendanceController,
      expressHttp
    );

    evaluationRoute.routes();
    noteRoute.routes();
    attendanceRoute.routes();
    app = expressHttp.getExpressInstance();
  });

  describe('Evaluation', () => {
    describe('On error', () => {
      describe('POST /evaluation', () => {
        it('should throw an error when the data to create an evaluation is wrong', async () => {
          const response = await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 18,
          });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /evaluation/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 10,
          });
          const evaluation = await supertest(app).get(`/evaluation/123`);
          expect(evaluation.status).toBe(200);
          expect(evaluation.body).toBe('');
        });
      });
      describe('PATCH /evaluation/:id', () => {
        it('should throw an error when the data to update an evaluation is wrong', async () => {
          const response = await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 10,
          });
          const id = response.body.id;
          const updatedEvaluation = await supertest(app)
            .patch(`/evaluation/${id}`)
            .send({
              lesson: 123,
            });
          expect(updatedEvaluation.status).toBe(404);
          expect(updatedEvaluation.body.error).toBeDefined();
        });
      });
      describe('DELETE /evaluation/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 10,
          });
          const result = await supertest(app).delete(`/evaluation/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /evaluation', () => {
        it('should create an evaluation', async () => {
          const response = await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 10,
          });
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /evaluation/:id', () => {
        it('should find an evaluation by ID', async () => {
          const response = await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 10,
          });
          const id = response.body.id;
          const evaluation = await supertest(app).get(`/evaluation/${id}`);
          expect(evaluation.status).toBe(200);
          expect(evaluation.body).toBeDefined();
        });
      });
      describe('GET /evaluation/', () => {
        it('should find all evaluations', async () => {
          await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 10,
          });
          await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 10,
          });
          const response = await supertest(app).get('/evaluation');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /evaluation/:id', () => {
        it('should update an evaluation by ID', async () => {
          const response = await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 10,
          });
          const id = response.body.id;
          const updatedEvaluation = await supertest(app)
            .patch(`/evaluation/${id}`)
            .send({
              lesson: new Id().id,
              teacher: new Id().id,
              type: 'evaluation',
              value: 10,
            });
          expect(updatedEvaluation.status).toBe(200);
          expect(updatedEvaluation.body).toBeDefined();
        });
      });
      describe('DELETE /evaluation/:id', () => {
        it('should delete an evaluation by ID', async () => {
          const response = await supertest(app).post('/evaluation').send({
            lesson: new Id().id,
            teacher: new Id().id,
            type: 'evaluation',
            value: 10,
          });
          const id = response.body.id;
          const result = await supertest(app).delete(`/evaluation/${id}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
  describe('Note', () => {
    describe('On error', () => {
      describe('POST /note', () => {
        it('should throw an error when the data to create a note is wrong', async () => {
          const response = await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: 123,
            note: 10,
          });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /note/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: new Id().id,
            note: 10,
          });
          const note = await supertest(app).get(`/note/123`);
          expect(note.status).toBe(200);
          expect(note.body).toBe('');
        });
      });
      describe('PATCH /note/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: new Id().id,
            note: 10,
          });
          const id = response.body.id;
          const updatedNote = await supertest(app)
            .patch(`/note/${id}`)
            .send({ note: 11 });
          expect(updatedNote.status).toBe(404);
          expect(updatedNote.body.error).toBeDefined();
        });
      });
      describe('DELETE /note/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: new Id().id,
            note: 10,
          });
          const result = await supertest(app).delete(`/note/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /note', () => {
        it('should create a note', async () => {
          const response = await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: new Id().id,
            note: 10,
          });
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /note/:id', () => {
        it('should find a note by ID', async () => {
          const response = await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: new Id().id,
            note: 10,
          });
          const id = response.body.id;
          const note = await supertest(app).get(`/note/${id}`);
          expect(note.status).toBe(200);
          expect(note.body).toBeDefined();
        });
      });
      describe('GET /note/', () => {
        it('should find all users', async () => {
          await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: new Id().id,
            note: 10,
          });
          await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: new Id().id,
            note: 10,
          });
          const response = await supertest(app).get('/note');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /note/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: new Id().id,
            note: 10,
          });
          const id = response.body.id;
          const updatedNote = await supertest(app).patch(`/note/${id}`).send({
            note: 5,
          });
          expect(updatedNote.status).toBe(200);
          expect(updatedNote.body).toBeDefined();
        });
      });
      describe('DELETE /note/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app).post('/note').send({
            evaluation: new Id().id,
            student: new Id().id,
            note: 10,
          });
          const id = response.body.id;
          const result = await supertest(app).delete(`/note/${id}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
  describe('Attendance', () => {
    describe('On error', () => {
      describe('POST /attendance', () => {
        it('should throw an error when the data to create an attendance is wrong', async () => {
          const response = await supertest(app)
            .post('/attendance')
            .send({
              date: new Date('02/10/26'),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /attendance/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          const response = await supertest(app).get(`/attendance/123`);
          expect(response.status).toBe(200);
          expect(response.body).toBe('');
        });
      });
      describe('PATCH /attendance/:id', () => {
        it('should throw an error when the data to update an attendance is wrong', async () => {
          const response = await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const updatedAttendance = await supertest(app)
            .patch(`/attendance/${id}`)
            .send({
              day: '',
            });
          expect(updatedAttendance.status).toBe(404);
          expect(updatedAttendance.body.error).toBeDefined();
        });
      });
      describe('DELETE /attendance/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          const result = await supertest(app).delete(`/attendance/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /attendance/add/students', () => {
        it('should throw an error when the students`ID is incorrect', async () => {
          const response = await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/attendance/add/students')
            .send({
              id: id,
              newStudentsList: ['invalidId'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
      describe('POST /attendance/remove/students', () => {
        it('should throw an error when the ID is incorrect', async () => {
          const input = {
            date: new Date(),
            day: 'fri' as DayOfWeek,
            hour: '06:50' as Hour,
            lesson: new Id().id,
            studentsPresent: [new Id().id, new Id().id, new Id().id],
          };
          await supertest(app).post('/attendance').send(input);
          const result = await supertest(app)
            .post('/attendance/remove/students')
            .send({
              id: new Id().id,
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined;
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /attendance', () => {
        it('should create an attendance', async () => {
          const response = await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /attendance/:id', () => {
        it('should find an attendance by ID', async () => {
          const response = await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const note = await supertest(app).get(`/attendance/${id}`);
          expect(note.status).toBe(200);
          expect(note.body).toBeDefined();
        });
      });
      describe('GET /attendance/', () => {
        it('should find all attendance', async () => {
          await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          const response = await supertest(app).get('/attendance');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined;
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /attendance/:id', () => {
        it('should update an attendance by ID', async () => {
          const response = await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const updatedAttendance = await supertest(app)
            .patch(`/attendance/${id}`)
            .send({
              hour: '12:00',
            });
          expect(updatedAttendance.status).toBe(200);
          expect(updatedAttendance.body).toBeDefined();
        });
      });
      describe('DELETE /attendance/:id', () => {
        it('should delete an attendance by ID', async () => {
          const response = await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const result = await supertest(app).delete(`/attendance/${id}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
      describe('POST /attendance/add/students', () => {
        it('should add students to the attendance', async () => {
          const response = await supertest(app)
            .post('/attendance')
            .send({
              date: new Date(),
              day: 'fri' as DayOfWeek,
              hour: '06:50' as Hour,
              lesson: new Id().id,
              studentsPresent: [new Id().id, new Id().id, new Id().id],
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/attendance/add/students')
            .send({
              id,
              newStudentsList: [new Id().id],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined;
        });
      });
      describe('POST /attendance/remove/students', () => {
        it('should remove students from the attendance', async () => {
          const input = {
            date: new Date(),
            day: 'fri' as DayOfWeek,
            hour: '06:50' as Hour,
            lesson: new Id().id,
            studentsPresent: [new Id().id, new Id().id, new Id().id],
          };
          const response = await supertest(app).post('/attendance').send(input);
          const id = response.body.id;
          const result = await supertest(app)
            .post('/attendance/remove/students')
            .send({
              id,
              studentsListToRemove: [input.studentsPresent[0]],
            });
          expect(result.status).toBe(201);
          expect(result.body.error).toBeDefined;
        });
      });
    });
  });
});
