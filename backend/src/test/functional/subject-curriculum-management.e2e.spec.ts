import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express-http';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import MemorySubjectRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/subject.repository';
import MemoryCurriculumRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/curriculum.repository';
import CreateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/createSubject.usecase';
import FindSubject from '@/modules/subject-curriculum-management/application/usecases/subject/findSubject.usecase';
import FindAllSubject from '@/modules/subject-curriculum-management/application/usecases/subject/findAllSubject.usecase';
import UpdateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/updateSubject.usecase';
import DeleteSubject from '@/modules/subject-curriculum-management/application/usecases/subject/deleteSubject.usecase';
import CreateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/createCurriculum.usecase';
import FindCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/findCurriculum.usecase';
import FindAllCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/findAllCurriculum.usecase';
import UpdateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/updateCurriculum.usecase';
import DeleteCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/deleteCurriculum.usecase';
import AddSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/addSubjects.usecase';
import RemoveSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/removeSubjects.usecase';
import { SubjectController } from '@/modules/subject-curriculum-management/interface/controller/subject.controller';
import { CurriculumController } from '@/modules/subject-curriculum-management/interface/controller/curriculum.controller';
import { SubjectRoute } from '@/modules/subject-curriculum-management/interface/route/subject.route';
import { CurriculumRoute } from '@/modules/subject-curriculum-management/interface/route/curriculum.route';

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
    const tokerService = tokenInstance();

    const authUserMiddlewareSubject = new AuthUserMiddleware(tokerService, [
      'master',
      'administrator',
    ]);
    const authUserMiddlewareCurriculum = new AuthUserMiddleware(tokerService, [
      'master',
      'administrator',
    ]);

    const subjectRoute = new SubjectRoute(
      subjectController,
      expressHttp,
      authUserMiddlewareSubject
    );
    const curriculumRoute = new CurriculumRoute(
      curriculumController,
      expressHttp,
      authUserMiddlewareCurriculum
    );

    subjectRoute.routes();
    curriculumRoute.routes();
    app = expressHttp.getExpressInstance();
  });

  describe('Subject', () => {
    describe('On error', () => {
      describe('POST /subject', () => {
        it('should throw an error when the data to create a user is wrong', async () => {
          const response = await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Des',
            });
          expect(response.status).toBe(400);
          expect(response.body.error).toBeDefined();
        });
      });
      describe('GET /subject/:id', () => {
        it('should return empty string when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Described a subject',
            });
          const subject = await supertest(app)
            .get(`/subject/123`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(subject.status).toBe(400);
          expect(subject.body.error).toBeDefined();
        });
      });
      describe('PATCH /subject/:id', () => {
        it('should throw an error when the data to update a subject is wrong', async () => {
          const response = await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Described a subject',
            });
          const id = response.body.id;
          const updatedSubject = await supertest(app)
            .patch(`/subject/${id}`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              description: '',
            });
          expect(updatedSubject.status).toBe(400);
          expect(updatedSubject.body.error).toBeDefined();
        });
      });
      describe('DELETE /subject/:id', () => {
        it('should throw an error when the ID is wrong or non-standard', async () => {
          await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Described a subject',
            });
          const result = await supertest(app)
            .delete(`/subject/123`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
    });
    describe('On sucess', () => {
      describe('POST /subject', () => {
        it('should create a user', async () => {
          const response = await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Described a subject',
            });
          expect(response.status).toBe(201);
          expect(response.body.id).toBeDefined();
        });
      });
      describe('GET /subject/:id', () => {
        it('should find a user by ID', async () => {
          const response = await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Described a subject',
            });
          const id = response.body.id;
          const subject = await supertest(app)
            .get(`/subject/${id}`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(subject.status).toBe(200);
          expect(subject.body).toBeDefined();
        });
      });
      describe('GET /subjects/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Described a subject',
            });
          await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Described a subject',
            });
          const response = await supertest(app)
            .get('/subjects')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /subject/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Described a subject',
            });
          const id = response.body.id;
          const updatedSubject = await supertest(app)
            .patch(`/subject/${id}`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              description: ' New describe',
            });
          expect(updatedSubject.status).toBe(200);
          expect(updatedSubject.body).toBeDefined();
        });
      });
      describe('DELETE /subject/:id', () => {
        it('should delete a user by ID', async () => {
          const response = await supertest(app)
            .post('/subject')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              description: 'Described a subject',
            });
          const id = response.body.id;
          const result = await supertest(app)
            .delete(`/subject/${id}`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
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
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const curriculum = await supertest(app)
            .get(`/curriculum/123`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(curriculum.status).toBe(400);
          expect(curriculum.body.error).toBeDefined();
        });
      });
      describe('PATCH /curriculum/:id', () => {
        it('should throw an error when the data to update a user is wrong', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const updatedCurriculum = await supertest(app)
            .patch(`/curriculum/${id}`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const result = await supertest(app)
            .delete(`/curriculum/123`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(400);
          expect(result.body.error).toBeDefined();
        });
      });
      describe('POST /curriculum/add', () => {
        it('should throw an error when the subject`ID is incorrect', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/curriculum/add')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          await supertest(app)
            .post('/curriculum')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const result = await supertest(app)
            .post('/curriculum/remove')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
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
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const curriculum = await supertest(app)
            .get(`/curriculum/${id}`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(curriculum.status).toBe(200);
          expect(curriculum.body).toBeDefined();
        });
      });
      describe('GET /curriculums/', () => {
        it('should find all users', async () => {
          await supertest(app)
            .post('/curriculum')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          await supertest(app)
            .post('/curriculum')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const response = await supertest(app)
            .get('/curriculums')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
          expect(response.body.length).toBe(2);
        });
      });
      describe('PATCH /curriculum/:id', () => {
        it('should update a user by ID', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const updatedCurriculum = await supertest(app)
            .patch(`/curriculum/${id}`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .delete(`/curriculum/${id}`)
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            );
          expect(result.status).toBe(200);
          expect(result.body.message).toBe('Operação concluída com sucesso');
        });
      });
      describe('POST /curriculum/add', () => {
        it('should add subjects to the curriculum', async () => {
          const response = await supertest(app)
            .post('/curriculum')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
              name: 'Math',
              subjectsList: [new Id().id, new Id().id, new Id().id],
              yearsToComplete: 5,
            });
          const id = response.body.id;
          const result = await supertest(app)
            .post('/curriculum/add')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
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
          const response = await supertest(app)
            .post('/curriculum')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send(input);
          const id = response.body.id;
          const result = await supertest(app)
            .post('/curriculum/remove')
            .set(
              'authorization',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXN0ZXJJZCI6ImNlNjNiY2E1LWNlNGItNDVhOC1iMTg4LWJjNGZlYzdlNDc5YiIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwicm9sZSI6Im1hc3RlciIsImlhdCI6MTcxMDUyMjQzMSwiZXhwIjoxNzUzNzIyNDMxfQ.FOtI4YnQibmm-x43349yuMF7T3YZ-ImedU_IhXYqwng'
            )
            .send({
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
