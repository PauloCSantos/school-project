import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { CurriculumController } from '@/interface/controller/subject-curriculum-management/curriculum.controller';
import { CurriculumRoute } from '@/interface/route/subject-curriculum-management/curriculum.route';

const mockCurriculumController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().id }),
    find: jest.fn().mockResolvedValue({
      name: 'Math',
      subjectsList: [new Id().id, new Id().id, new Id().id],
      yearsToComplete: 5,
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        name: 'Math',
        subjectsList: [new Id().id, new Id().id, new Id().id],
        yearsToComplete: 5,
      },
      {
        name: 'Spanish',
        subjectsList: [new Id().id, new Id().id, new Id().id],
        yearsToComplete: 5,
      },
    ]),
    update: jest.fn().mockResolvedValue({
      name: 'Math',
      yearsToComplete: 5,
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
    addSubjects: jest.fn().mockResolvedValue('1 value was entered'),
    removeSubjects: jest.fn().mockResolvedValue('2 values were removed'),
  } as unknown as CurriculumController;
});

describe('CurriculumRoute unit test', () => {
  const curriculumController = mockCurriculumController();
  const expressHttp = new ExpressHttp();
  const curriculumRoute = new CurriculumRoute(
    curriculumController,
    expressHttp
  );
  curriculumRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST /curriculum', () => {
    it('should create a curriculum', async () => {
      const response = await supertest(app)
        .post('/curriculum')
        .send({
          name: 'Math',
          subjectsList: [new Id().id, new Id().id, new Id().id],
          yearsToComplete: 5,
        });
      expect(response.status).toBe(201);
      expect(curriculumController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET /curriculum/:id', () => {
    it('should find a curriculum by ID', async () => {
      const response = await supertest(app).get('/curriculum/123');
      expect(response.status).toBe(200);
      expect(curriculumController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /curriculum/', () => {
    it('should find all curriculums', async () => {
      const response = await supertest(app).get('/curriculum');
      expect(response.status).toBe(200);
      expect(curriculumController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined;
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH /curriculum/:id', () => {
    it('should update a curriculum by ID', async () => {
      const response = await supertest(app).patch('/curriculum/123').send({
        yearsToComplete: 6,
      });
      expect(response.status).toBe(200);
      expect(curriculumController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE /curriculum/:id', () => {
    it('should delete a curriculum by ID', async () => {
      const response = await supertest(app).delete('/curriculum/123');
      expect(response.status).toBe(200);
      expect(curriculumController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined;
    });
  });
  describe('POST /curriculum/add', () => {
    it('should add subjects to the curriculum', async () => {
      const response = await supertest(app)
        .post('/curriculum/add')
        .send({
          id: new Id().id,
          newSubjectsList: [new Id().id],
        });
      expect(response.status).toBe(201);
      expect(curriculumController.addSubjects).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
  describe('POST /curriculum/remove', () => {
    it('should remove subjects from the curriculum', async () => {
      const response = await supertest(app)
        .post('/curriculum/remove')
        .send({
          id: new Id().id,
          subjectsListToRemove: [new Id().id, new Id().id],
        });
      expect(response.status).toBe(201);
      expect(curriculumController.removeSubjects).toHaveBeenCalled();
      expect(response.body).toBeDefined;
    });
  });
});
