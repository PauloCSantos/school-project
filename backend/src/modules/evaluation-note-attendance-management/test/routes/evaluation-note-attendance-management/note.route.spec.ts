import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import NoteController from '@/modules/evaluation-note-attendance-management/interface/controller/note.controller';
import NoteRoute from '@/modules/evaluation-note-attendance-management/interface/route/note.route';

describe('NoteRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let noteController: NoteController;
  let middleware: AuthUserMiddleware;

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    noteController = {
      findAll: jest.fn().mockResolvedValue([{ id: new Id().value }]),
      create: jest.fn().mockResolvedValue({ id: new Id().value }),
      find: jest.fn().mockImplementation(({ id }) => Promise.resolve({ id })),
      update: jest.fn().mockImplementation(({ id }) => Promise.resolve({ id })),
      delete: jest
        .fn()
        .mockResolvedValue({ message: 'Operação concluída com sucesso' }),
    } as unknown as NoteController;

    middleware = {
      handle: jest.fn((_req, next) => next()),
    } as unknown as AuthUserMiddleware;

    new NoteRoute(noteController, http, middleware).routes();
  });

  describe('success', () => {
    it('should find all notes', async () => {
      const response = await supertest(app)
        .get('/notes')
        .send({ quantity: 2, offset: 0 });

      expect(response.statusCode).toBe(200);
      expect(noteController.findAll).toHaveBeenCalledWith({
        quantity: 2,
        offset: 0,
      });
      expect(response.body).toEqual([{ id: expect.any(String) }]);
    });

    it('should create a new note', async () => {
      const payload = {
        evaluation: new Id().value,
        student: new Id().value,
        note: 9.5,
      };
      const response = await supertest(app).post('/note').send(payload);

      expect(response.statusCode).toBe(201);
      expect(noteController.create).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id: expect.any(String) });
    });

    it('should find note by id', async () => {
      const id = new Id().value;
      const response = await supertest(app).get(`/note/${id}`);

      expect(response.statusCode).toBe(200);
      expect(noteController.find).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({ id });
    });

    it('should update a note', async () => {
      const id = new Id().value;
      const payload = {
        id,
        evaluation: new Id().value,
      };
      const response = await supertest(app).patch(`/note`).send(payload);

      expect(response.statusCode).toBe(200);
      expect(noteController.update).toHaveBeenCalledWith(payload);
      expect(response.body).toEqual({ id });
    });

    it('should delete a note by ID', async () => {
      const id = new Id().value;
      const response = await supertest(app).delete(`/note/${id}`);

      expect(response.statusCode).toBe(200);
      expect(noteController.delete).toHaveBeenCalledWith({ id });
      expect(response.body).toEqual({
        message: 'Operação concluída com sucesso',
      });
    });
  });

  describe('failure', () => {
    it('should return 400 for invalid quantity or offset', async () => {
      const response = await supertest(app)
        .get('/notes')
        .send({ offset: 'invalid' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on find', async () => {
      const response = await supertest(app).get('/note/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });

    it('should return 400 for invalid id on update', async () => {
      const response = await supertest(app).patch('/note').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/note/invalid-id');

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: 'Bad Request' });
    });
  });
});
