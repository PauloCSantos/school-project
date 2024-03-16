import AddSubjects from '@/application/usecases/subject-curriculum-management/curriculum/addSubjects.usecase';
import CreateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/createCurriculum.usecase';
import DeleteCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/deleteCurriculum.usecase';
import FindAllCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findAllCurriculum.usecase';
import FindCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findCurriculum.usecase';
import RemoveSubjects from '@/application/usecases/subject-curriculum-management/curriculum/removeSubjects.usecase';
import UpdateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/updateCurriculum.usecase';
import CreateSubject from '@/application/usecases/subject-curriculum-management/subject/createSubject.usecase';
import DeleteSubject from '@/application/usecases/subject-curriculum-management/subject/deleteSubject.usecase';
import FindAllSubject from '@/application/usecases/subject-curriculum-management/subject/findAllSubject.usecase';
import FindSubject from '@/application/usecases/subject-curriculum-management/subject/findSubject.usecase';
import UpdateSubject from '@/application/usecases/subject-curriculum-management/subject/updateSubject.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryCurriculumRepository from '@/infraestructure/repositories/subject-curriculum-management/memory-repository/curriculum.repository';
import MemorySubjectRepository from '@/infraestructure/repositories/subject-curriculum-management/memory-repository/subject.repository';
import { CurriculumController } from '@/interface/controller/subject-curriculum-management/curriculum.controller';
import { SubjectController } from '@/interface/controller/subject-curriculum-management/subject.controller';
import { CurriculumRoute } from '@/interface/route/subject-curriculum-management/curriculum.route';
import { SubjectRoute } from '@/interface/route/subject-curriculum-management/subject.route';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';

describe('Subject curriculum management module end to end test', () => {
  let subjectRepository = new MemorySubjectRepository();
  let curriculumRepository = new MemoryCurriculumRepository();
  let app: any;
  beforeEach(() => {
    subjectRepository = new MemorySubjectRepository();
    curriculumRepository = new MemoryCurriculumRepository();

    const createSubjectUsecase = new CreateSubject(subjectRepository);
    const findSubjectUsecase = new FindSubject(subjectRepository);
    const findAllSubjectUsecase = new FindAllSubject(subjectRepository);
    const updateSubjectUsecase = new UpdateSubject(subjectRepository);
    const deleteSubjectUsecase = new DeleteSubject(subjectRepository);

    const createCurriculumUsecase = new CreateCurriculum(curriculumRepository);
    const findCurriculumUsecase = new FindCurriculum(curriculumRepository);
    const findAllCurriculumUsecase = new FindAllCurriculum(
      curriculumRepository
    );
    const updateCurriculumUsecase = new UpdateCurriculum(curriculumRepository);
    const deleteCurriculumUsecase = new DeleteCurriculum(curriculumRepository);
    const addSubjects = new AddSubjects(curriculumRepository);
    const removeSubjects = new RemoveSubjects(curriculumRepository);

    const subjectController = new SubjectController(
      createSubjectUsecase,
      findSubjectUsecase,
      findAllSubjectUsecase,
      updateSubjectUsecase,
      deleteSubjectUsecase
    );
    const curriculumController = new CurriculumController(
      createCurriculumUsecase,
      findCurriculumUsecase,
      findAllCurriculumUsecase,
      updateCurriculumUsecase,
      deleteCurriculumUsecase,
      addSubjects,
      removeSubjects
    );

    const expressHttp = new ExpressHttp();

    const subjectRoute = new SubjectRoute(subjectController, expressHttp);
    const curriculumRoute = new CurriculumRoute(
      curriculumController,
      expressHttp
    );

    subjectRoute.routes();
    curriculumRoute.routes();
    app = expressHttp.getExpressInstance();
  });

  describe('Subject', () => {
    describe('On error', () => {
      describe('POST /subject', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          const response = await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Des',
          });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /subject/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Described a subject',
          });
          const subject = await supertest(app).get(`/subject/123`);
          expect(subject.status).toBe(400);
          expect(subject.body.error).toBeDefined();
        });
      });
      describe('PATCH /subject/:id', () => {
        it('should throw an error when the data to update a subject is wrong', async () => {
          const response = await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Described a subject',
          });
          const id = response.body.id;
          const updatedSubject = await supertest(app)
            .patch(`/subject/${id}`)
            .send({
              description: '',
            });
          expect(updatedSubject.status).toBe(400);
          expect(updatedSubject.body.error).toBeDefined();
        });
      });
      describe('DELETE /subject/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Described a subject',
          });
          const result = await supertest(app).delete(`/subject/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /subject', () => {
        it('should create a user', async () => {
          const response = await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Described a subject',
          });
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /subject/:id', () => {
        it('should find a user by ID', async () => {
          const response = await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Described a subject',
          });
          const id = response.body.id;
          const subject = await supertest(app).get(`/subject/${id}`);
          expect(subject.status).toBe(200);
          expect(subject.body).toBeDefined();
        });
      });
      describe('GET /subjects/', () => {
        it('should find all users', async () => {
          await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Described a subject',
          });
          await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Described a subject',
          });
          const response = await supertest(app).get('/subjects');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /subject/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Described a subject',
          });
          const id = response.body.id;
          const updatedSubject = await supertest(app)
            .patch(`/subject/${id}`)
            .send({
              description: ' New describe',
            });
          expect(updatedSubject.status).toBe(200);
          expect(updatedSubject.body).toBeDefined();
        });
      });
      describe('DELETE /subject/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app).post('/subject').send({
            name: 'Math',
            description: 'Described a subject',
          });
          const id = response.body.id;
          const result = await supertest(app).delete(`/subject/${id}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
    });
  });
  describe('Curriculum', () => {
    describe('On error', () => {
      describe('POST /curriculum', () => {
        it('should throw an error when the data to create a curriculum is wrong', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 0,
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /curriculum/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const curriculum = await supertest(app).get(`/curriculum/123`);
          expect(curriculum.status).toBe(400);
          expect(curriculum.body.error).toBeDefined();
        });
      });
      describe('PATCH /curriculum/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const updatedCurriculum = await supertest(app)
            .patch(`/curriculum/${id}`)
            .send({
              name: 'Ma',
              yearsToComplete: -2,
            });
          expect(updatedCurriculum.status).toBe(400);
          expect(updatedCurriculum.body.error).toBeDefined();
        });
      });
      describe('DELETE /curriculum/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const result = await supertest(app).delete(`/curriculum/123`);
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /curriculum/add', () => {
        it('should throw an error when the subject`ID is incorrect', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/curriculum/add')
            .send({
              id: id,
              newSubjectsList: ['123'],
            });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /curriculum/remove', () => {
        it('should throw an error when the ID is incorrect', async () => {
          const input = {
            name: 'Math',
            subjectsList: [new Id().id, new Id().id, new Id().id],
            yearsToComplete: 5,
          };
          await supertest(app).post('/curriculum').send(input);
          const result = await supertest(app).post('/curriculum/remove').send({
            id: new Id().id,
            subjectsListToRemove: input.subjectsList,
          });
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /curriculum', () => {
        it('should create a user', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /curriculum/:id', () => {
        it('should find a user by ID', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const curriculum = await supertest(app).get(`/curriculum/${id}`);
          expect(curriculum.status).toBe(200);
          expect(curriculum.body).toBeDefined();
        });
      });
      describe('GET /curriculums/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const response = await supertest(app).get('/curriculums');
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /curriculum/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const updatedCurriculum = await supertest(app)
            .patch(`/curriculum/${id}`)
            .send({
              name: 'Math II',
              yearsToComplete: 8,
            });
          expect(updatedCurriculum.status).toBe(200);
          expect(updatedCurriculum.body).toBeDefined();
        });
      });
      describe('DELETE /curriculum/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const result = await supertest(app).delete(`/curriculum/${id}`);
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
      describe('POST /curriculum/add', () => {
        it('should add subjects to the curriculum', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/curriculum/add')
            .send({
              id: id,
              newSubjectsList: [new Id().id],
            });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined();
        });
      });
      describe('POST /curriculum/remove', () => {
        it('should remove subjects from the curriculum', async () => {
          const input = {
            name: 'Math',
            subjectsList: [new Id().id, new Id().id, new Id().id],
            yearsToComplete: 5,
          };
          const response = await supertest(app).post('/curriculum').send(input);
          const id = response.body.id;
          const result = await supertest(app).post('/curriculum/remove').send({
            id: id,
            subjectsListToRemove: input.subjectsList,
          });
          expect(result.status).toBe(201);
          expect(result.body).toBeDefined();
        });
      });
    });
  });
});
