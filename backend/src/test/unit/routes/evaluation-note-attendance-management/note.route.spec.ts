import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/infraestructure/http/express-http';
import { NoteController } from '@/interface/controller/evaluation-note-attendance-management/note.controller';
import { NoteRoute } from '@/interface/route/evaluation-note-attendance-management/note.route';

const mockNoteController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().id }),
    find: jest.fn().mockResolvedValue({
      evaluation: new Id().id,
      student: new Id().id,
      note: 10,
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        evaluation: new Id().id,
        student: new Id().id,
        note: 10,
      },
      {
        evaluation: new Id().id,
        student: new Id().id,
        note: 10,
      },
    ]),
    update: jest.fn().mockResolvedValue({
      evaluation: new Id().id,
      student: new Id().id,
      note: 10,
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
  } as unknown as NoteController;
});

describe('NoteRoute unit test', () => {
  const noteController = mockNoteController();
  const expressHttp = new ExpressHttp();
  const noteRoute = new NoteRoute(noteController, expressHttp);
  noteRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST/note', () => {
    it('should create a note', async () => {
      const response = await supertest(app).post('/note').send({
        evaluation: new Id().id,
        student: new Id().id,
        note: 10,
      });
      expect(response.status).toBe(201);
      expect(noteController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET/note/:id', () => {
    it('should find a note by ID', async () => {
      const response = await supertest(app).get('/note/123');
      expect(response.status).toBe(200);
      expect(noteController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET/note/', () => {
    it('should find all notes', async () => {
      const response = await supertest(app).get('/note');
      expect(response.status).toBe(200);
      expect(noteController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined;
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH/note/:id', () => {
    it('should update a note by ID', async () => {
      const response = await supertest(app).patch('/note/123').send({
        description: 'New description',
      });
      expect(response.status).toBe(200);
      expect(noteController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE/note/:id', () => {
    it('should delete a note by ID', async () => {
      const response = await supertest(app).delete('/note/123');
      expect(response.status).toBe(200);
      expect(noteController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined;
    });
  });
});
