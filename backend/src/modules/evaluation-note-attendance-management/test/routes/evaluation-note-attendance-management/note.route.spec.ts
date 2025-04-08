import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import { NoteController } from '@/modules/evaluation-note-attendance-management/interface/controller/note.controller';
import { NoteRoute } from '@/modules/evaluation-note-attendance-management/interface/route/note.route';

const mockAuthUserMiddleware = jest.fn(
  () =>
    ({
      //@ts-expect-error
      handle: jest.fn((req: any, res: any, next: any) => next()),
    }) as unknown as AuthUserMiddleware
);

const mockNoteController = jest.fn(() => {
  return {
    create: jest.fn().mockResolvedValue({ id: new Id().value }),
    find: jest.fn().mockResolvedValue({
      evaluation: new Id().value,
      student: new Id().value,
      note: 10,
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        evaluation: new Id().value,
        student: new Id().value,
        note: 10,
      },
      {
        evaluation: new Id().value,
        student: new Id().value,
        note: 10,
      },
    ]),
    update: jest.fn().mockResolvedValue({
      evaluation: new Id().value,
      student: new Id().value,
      note: 10,
    }),
    delete: jest.fn().mockResolvedValue({
      message: 'Operação concluída com sucesso',
    }),
  } as unknown as NoteController;
});

describe('NoteRoute unit test', () => {
  const noteController = mockNoteController();
  const authUserMiddleware = mockAuthUserMiddleware();
  const expressHttp = new ExpressHttp();
  const noteRoute = new NoteRoute(
    noteController,
    expressHttp,
    authUserMiddleware
  );
  noteRoute.routes();
  const app = expressHttp.getExpressInstance();

  describe('POST/note', () => {
    it('should create a note', async () => {
      const response = await supertest(app).post('/note').send({
        evaluation: new Id().value,
        student: new Id().value,
        note: 10,
      });
      expect(response.status).toBe(201);
      expect(noteController.create).toHaveBeenCalled();
      expect(response.body.id).toBeDefined();
    });
  });
  describe('GET/note/:id', () => {
    it('should find a note by ID', async () => {
      const response = await supertest(app).get(`/note/${new Id().value}`);
      expect(response.status).toBe(200);
      expect(noteController.find).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('GET/notes/', () => {
    it('should find all notes', async () => {
      const response = await supertest(app).get('/notes');
      expect(response.status).toBe(200);
      expect(noteController.findAll).toHaveBeenCalled();
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(2);
    });
  });
  describe('PATCH/note/:id', () => {
    it('should update a note by ID', async () => {
      const response = await supertest(app)
        .patch(`/note/${new Id().value}`)
        .send({
          description: 'New description',
        });
      expect(response.status).toBe(200);
      expect(noteController.update).toHaveBeenCalled();
      expect(response.body).toBeDefined();
    });
  });
  describe('DELETE/note/:id', () => {
    it('should delete a note by ID', async () => {
      const response = await supertest(app).delete(`/note/${new Id().value}`);
      expect(response.status).toBe(200);
      expect(noteController.delete).toHaveBeenCalled();
      expect(response.body.message).toBeDefined();
    });
  });
});
