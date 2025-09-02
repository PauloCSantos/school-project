import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import AuthUser from '@/modules/authentication-authorization-management/domain/entity/user.entity';
import { AuthUserService } from '@/modules/authentication-authorization-management/infrastructure/services/user-entity.service';
import MemorySubjectRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/subject.repository';
import CreateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/create.usecase';
import FindSubject from '@/modules/subject-curriculum-management/application/usecases/subject/find.usecase';
import FindAllSubject from '@/modules/subject-curriculum-management/application/usecases/subject/find-all.usecase';
import UpdateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/update.usecase';
import DeleteSubject from '@/modules/subject-curriculum-management/application/usecases/subject/delete.usecase';
import { SubjectController } from '@/modules/subject-curriculum-management/interface/controller/subject.controller';
import { SubjectRoute } from '@/modules/subject-curriculum-management/interface/route/subject.route';
import MemoryCurriculumRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/curriculum.repository';
import CreateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/create.usecase';
import FindCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/find.usecase';
import FindAllCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/find-all.usecase';
import UpdateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/update.usecase';
import DeleteCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/delete.usecase';
import AddSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/add-subjects.usecase';
import RemoveSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/remove-subjects.usecase';
import { CurriculumController } from '@/modules/subject-curriculum-management/interface/controller/curriculum.controller';
import { CurriculumRoute } from '@/modules/subject-curriculum-management/interface/route/curriculum.route';

let tokenService: TokenService;

async function makeToken(): Promise<string> {
  const authService = new AuthUserService();
  const authUser = new AuthUser(
    {
      email: 'subjectcurriculum@example.com',
      password: 'StrongPass1!',
      isHashed: false,
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

describe('Subject curriculum management module end to end test', () => {
  let subjectRepository: MemorySubjectRepository;
  let curriculumRepository: MemoryCurriculumRepository;
  let app: any;

  beforeEach(() => {
    subjectRepository = new MemorySubjectRepository();
    curriculumRepository = new MemoryCurriculumRepository();
    const policiesService = new PoliciesService();

    tokenService = new TokenService('e2e-secret');

    const createSubjectUsecase = new CreateSubject(subjectRepository, policiesService);
    const findSubjectUsecase = new FindSubject(subjectRepository, policiesService);
    const findAllSubjectUsecase = new FindAllSubject(subjectRepository, policiesService);
    const updateSubjectUsecase = new UpdateSubject(subjectRepository, policiesService);
    const deleteSubjectUsecase = new DeleteSubject(subjectRepository, policiesService);

    const subjectController = new SubjectController(
      createSubjectUsecase,
      findSubjectUsecase,
      findAllSubjectUsecase,
      updateSubjectUsecase,
      deleteSubjectUsecase
    );

    const createCurriculumUsecase = new CreateCurriculum(
      curriculumRepository,
      policiesService
    );
    const findCurriculumUsecase = new FindCurriculum(
      curriculumRepository,
      policiesService
    );
    const findAllCurriculumUsecase = new FindAllCurriculum(
      curriculumRepository,
      policiesService
    );
    const updateCurriculumUsecase = new UpdateCurriculum(
      curriculumRepository,
      policiesService
    );
    const deleteCurriculumUsecase = new DeleteCurriculum(
      curriculumRepository,
      policiesService
    );
    const addSubjectsUsecase = new AddSubjects(curriculumRepository, policiesService);
    const removeSubjectsUsecase = new RemoveSubjects(
      curriculumRepository,
      policiesService
    );

    const curriculumController = new CurriculumController(
      createCurriculumUsecase,
      findCurriculumUsecase,
      findAllCurriculumUsecase,
      updateCurriculumUsecase,
      deleteCurriculumUsecase,
      addSubjectsUsecase,
      removeSubjectsUsecase
    );

    const expressHttp = new ExpressAdapter();
    const authMiddlewareSubject = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
      RoleUsersEnum.WORKER,
    ]);
    const authMiddlewareCurriculum = new AuthUserMiddleware(tokenService, [
      RoleUsersEnum.MASTER,
      RoleUsersEnum.ADMINISTRATOR,
      RoleUsersEnum.STUDENT,
      RoleUsersEnum.TEACHER,
      RoleUsersEnum.WORKER,
    ]);

    new SubjectRoute(subjectController, expressHttp, authMiddlewareSubject).routes();
    new CurriculumRoute(
      curriculumController,
      expressHttp,
      authMiddlewareCurriculum
    ).routes();

    app = expressHttp.getNativeServer();
  });

  describe('Subject', () => {
    describe('On error', () => {
      describe('MIDDLEWARE /subject', () => {
        it('should return 401 when authorization header is missing', async () => {
          const response = await supertest(app).get('/subjects');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid', async () => {
          const response = await supertest(app)
            .get('/subjects')
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('POST /subject', () => {
        it('should return 422 when the data to create a subject is wrong', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/subject')
            .set(headers)
            .send({
              name: 123,
              description: ['invalid'],
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('GET /subject/:id', () => {
        it('should return 400 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/subject/123').set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when subject does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/subject/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('PATCH /subject', () => {
        it('should return 400 when id is missing on body', async () => {
          const headers = await authHeader();
          const response = await supertest(app).patch('/subject').set(headers).send({
            name: 'No id',
          });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when id is malformed', async () => {
          const headers = await authHeader();
          const response = await supertest(app).patch('/subject').set(headers).send({
            id: '123',
            name: 'Bad id',
          });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when the data to update a subject is wrong', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/subject').set(headers).send({
            name: 'Math',
            description: 'Described a subject',
          });

          const response = await supertest(app).patch('/subject').set(headers).send({
            id: created.body.id,
            name: 999,
          });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to update a non-existent subject', async () => {
          const headers = await authHeader();
          const response = await supertest(app).patch('/subject').set(headers).send({
            id: new Id().value,
            name: 'Edited',
          });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('DELETE /subject/:id', () => {
        it('should return 422 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).delete('/subject/123').set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to delete a non-existent subject', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .delete(`/subject/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });

    describe('On success', () => {
      describe('GET /subjects (empty state)', () => {
        it('should return empty array when there are no subjects', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/subjects').set(headers);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(0);
        });
      });

      describe('POST /subject', () => {
        it('should create a subject', async () => {
          const headers = await authHeader();
          const response = await supertest(app).post('/subject').set(headers).send({
            name: 'Physics',
            description: 'Classical mechanics',
          });

          expect(response.status).toBe(201);
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
        });
      });

      describe('GET /subject/:id', () => {
        it('should find a subject by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/subject').set(headers).send({
            name: 'Chemistry',
            description: 'Organic chemistry',
          });

          const response = await supertest(app)
            .get(`/subject/${created.body.id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('GET /subjects', () => {
        it('should find all subjects', async () => {
          const headers = await authHeader();

          await supertest(app).post('/subject').set(headers).send({
            name: 'Biology',
            description: 'Cells and DNA',
          });
          await supertest(app).post('/subject').set(headers).send({
            name: 'History',
            description: 'World history',
          });

          const response = await supertest(app).get('/subjects').set(headers);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(2);
        });
      });

      describe('PATCH /subject', () => {
        it('should update a subject by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/subject').set(headers).send({
            name: 'Geography',
            description: 'Maps and climate',
          });

          const response = await supertest(app).patch('/subject').set(headers).send({
            id: created.body.id,
            description: 'Maps and climates',
          });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('DELETE /subject/:id', () => {
        it('should delete a subject by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/subject').set(headers).send({
            name: 'Philosophy',
            description: 'Epistemology',
          });

          const response = await supertest(app)
            .delete(`/subject/${created.body.id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
    });
  });

  describe('Curriculum', () => {
    describe('On error', () => {
      describe('MIDDLEWARE /curriculum', () => {
        it('should return 401 when authorization header is missing', async () => {
          const response = await supertest(app).get('/curriculums');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 401 when token is invalid', async () => {
          const response = await supertest(app)
            .get('/curriculums')
            .set('authorization', 'invalid');

          expect(response.status).toBe(401);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('POST /curriculum', () => {
        it('should return 422 when the data to create a curriculum is wrong', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 321,
              yearsToComplete: 5,
              subjectsList: [new Id().value],
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('GET /curriculum/:id', () => {
        it('should return 422 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/curriculum/123').set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when curriculum does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .get(`/curriculum/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('PATCH /curriculum', () => {
        it('should return 400 when id is missing on body', async () => {
          const headers = await authHeader();
          const response = await supertest(app).patch('/curriculum').set(headers).send({
            name: 'No id',
          });

          expect(response.status).toBe(400);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when id is malformed', async () => {
          const headers = await authHeader();
          const response = await supertest(app).patch('/curriculum').set(headers).send({
            id: '123',
            name: 'Bad id',
          });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 422 when the data to update a curriculum is wrong', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Ensino Médio',
              subjectsList: [new Id().value],
              yearsToComplete: 5,
            });

          const response = await supertest(app).patch('/curriculum').set(headers).send({
            id: created.body.id,
            yearsToComplete: -999,
          });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to update a non-existent curriculum', async () => {
          const headers = await authHeader();
          const response = await supertest(app).patch('/curriculum').set(headers).send({
            id: new Id().value,
            name: 'Updated',
          });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('DELETE /curriculum/:id', () => {
        it('should return 422 when the ID is wrong or non-standard', async () => {
          const headers = await authHeader();
          const response = await supertest(app).delete('/curriculum/123').set(headers);

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when trying to delete a non-existent curriculum', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .delete(`/curriculum/${new Id().value}`)
            .set(headers);

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('POST /curriculum/subject/add', () => {
        it('should return 422 when subjects list is invalid', async () => {
          const headers = await authHeader();
          const created = await supertest(app).post('/curriculum').set(headers).send({
            name: 'Grade 1',
            subjectsList: [],
            yearsToComplete: 9,
          });

          const response = await supertest(app)
            .post('/curriculum/subject/add')
            .set(headers)
            .send({
              id: created.body.id,
              newSubjectsList: [123],
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when curriculum does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/curriculum/subject/add')
            .set(headers)
            .send({
              id: new Id().value,
              newSubjectsList: [new Id().value],
            });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });

      describe('POST /curriculum/subject/remove', () => {
        it('should return 422 when subjects list is invalid', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Grade 2',
              subjectsList: [new Id().value],
              yearsToComplete: 5,
            });

          const response = await supertest(app)
            .post('/curriculum/subject/remove')
            .set(headers)
            .send({
              id: created.body.id,
              subjectsListToRemove: [123],
            });

          expect(response.status).toBe(422);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });

        it('should return 404 when curriculum does not exist', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/curriculum/subject/remove')
            .set(headers)
            .send({
              id: new Id().value,
              subjectsListToRemove: [new Id().value],
            });

          expect(response.status).toBe(404);
          expect(response.body.code).toBeDefined();
          expect(response.body.message).toBeDefined();
        });
      });
    });

    describe('On success', () => {
      describe('GET /curriculums (empty state)', () => {
        it('should return empty array when there are no curriculums', async () => {
          const headers = await authHeader();
          const response = await supertest(app).get('/curriculums').set(headers);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(0);
        });
      });

      describe('POST /curriculum', () => {
        it('should create a curriculum', async () => {
          const headers = await authHeader();
          const response = await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Fundamental I',
              subjectsList: [new Id().value],
              yearsToComplete: 5,
            });

          expect(response.status).toBe(201);
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
        });
      });

      describe('GET /curriculum/:id', () => {
        it('should find a curriculum by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Fundamental II',
              subjectsList: [new Id().value],
              yearsToComplete: 5,
            });

          const response = await supertest(app)
            .get(`/curriculum/${created.body.id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('GET /curriculums', () => {
        it('should find all curriculums', async () => {
          const headers = await authHeader();

          await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Grade A',
              subjectsList: [new Id().value],
              yearsToComplete: 5,
            });
          await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Grade B',
              subjectsList: [new Id().value],
              yearsToComplete: 5,
            });

          const response = await supertest(app).get('/curriculums').set(headers);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(2);
        });
      });

      describe('PATCH /curriculum', () => {
        it('should update a curriculum by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Grade C',
              subjectsList: [new Id().value],
              yearsToComplete: 5,
            });

          const response = await supertest(app).patch('/curriculum').set(headers).send({
            id: created.body.id,
            name: 'C updated',
          });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('DELETE /curriculum/:id', () => {
        it('should delete a curriculum by ID', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Grade D',
              subjectsList: [new Id().value],
              yearsToComplete: 5,
            });

          const response = await supertest(app)
            .delete(`/curriculum/${created.body.id}`)
            .set(headers);

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('POST /curriculum/subject/add', () => {
        it('should add subjects to the curriculum', async () => {
          const headers = await authHeader();
          const created = await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Curriculum E',
              subjectsList: [new Id().value],
              yearsToComplete: 5,
            });

          const response = await supertest(app)
            .post('/curriculum/subject/add')
            .set(headers)
            .send({
              id: created.body.id,
              newSubjectsList: [new Id().value, new Id().value],
            });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });

      describe('POST /curriculum/subject/remove', () => {
        it('should remove subjects from the curriculum', async () => {
          const headers = await authHeader();
          const subA = new Id().value;
          const created = await supertest(app)
            .post('/curriculum')
            .set(headers)
            .send({
              name: 'Curriculum F',
              subjectsList: [subA, new Id().value],
              yearsToComplete: 5,
            });

          const response = await supertest(app)
            .post('/curriculum/subject/remove')
            .set(headers)
            .send({
              id: created.body.id,
              subjectsListToRemove: [subA],
            });

          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
        });
      });
    });
  });
});
