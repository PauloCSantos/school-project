import Id from '@/modules/@shared/domain/value-object/id.value-object';
import supertest from 'supertest';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import NoteController from '@/modules/evaluation-note-attendance-management/interface/controller/note.controller';
import NoteRoute from '@/modules/evaluation-note-attendance-management/interface/route/note.route';

describe('NoteRoute with ExpressAdapter', () => {
  let http: ExpressAdapter;
  let app: any;
  let noteController: jest.Mocked<NoteController>;
  let middleware: AuthUserMiddleware;

  const baseNote = {
    evaluation: new Id().value,
    student: new Id().value,
    note: 9.5,
  };

  beforeEach(() => {
    http = new ExpressAdapter();
    app = http.getNativeServer();

    noteController = {
      findAll: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<NoteController>;

    middleware = {
      handle: jest.fn((_request: any, next: any) => {
        _request.tokenData = {
          email: 'user@example.com',
          role: 'administrator',
          masterId: 'validId',
        };
        return next();
      }),
    } as unknown as AuthUserMiddleware;

    new NoteRoute(noteController, http, middleware).routes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should find all notes with pagination', async () => {
      noteController.findAll.mockResolvedValue([
        { id: new Id().value, ...baseNote },
        { id: new Id().value, ...baseNote, note: 10 },
      ]);

      const response = await supertest(app).get('/notes?quantity=2&offset=0');

      expect(response.statusCode).toBe(200);
      expect(noteController.findAll).toHaveBeenCalledWith(
        { quantity: '2', offset: '0' },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should create a new note', async () => {
      const createdId = new Id().value;
      noteController.create.mockResolvedValue({ id: createdId });

      const response = await supertest(app).post('/note').send(baseNote);

      expect(response.statusCode).toBe(201);
      expect(noteController.create).toHaveBeenCalledWith(
        baseNote,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id: createdId });
    });

    it('should find note by id', async () => {
      const id = new Id().value;
      noteController.find.mockResolvedValue({ id, ...baseNote });

      const response = await supertest(app).get(`/note/${id}`);

      expect(response.statusCode).toBe(200);
      expect(noteController.find).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ id, ...baseNote });
    });

    it('should update a note', async () => {
      const id = new Id().value;
      const payload = { id, note: 8.75 };
      noteController.update.mockResolvedValue({ ...baseNote, ...payload, id });

      const response = await supertest(app).patch('/note').send(payload);

      expect(response.statusCode).toBe(200);
      expect(noteController.update).toHaveBeenCalledWith(
        payload,
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ ...baseNote, ...payload, id });
    });

    it('should delete a note by ID', async () => {
      const id = new Id().value;
      noteController.delete.mockResolvedValue({
        message: 'Operation completed successfully',
      });

      const response = await supertest(app).delete(`/note/${id}`);

      expect(response.statusCode).toBe(200);
      expect(noteController.delete).toHaveBeenCalledWith(
        { id },
        expect.objectContaining({
          email: expect.any(String),
          role: expect.any(String),
          masterId: expect.any(String),
        })
      );
      expect(response.body).toEqual({ message: 'Operation completed successfully' });
    });
  });

  describe('failure', () => {
    it('should return 422 for invalid quantity or offset', async () => {
      const response = await supertest(app).get('/notes?offset=invalid');

      expect(response.statusCode).toBe(422);
      expect(noteController.findAll).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on find', async () => {
      const response = await supertest(app).get('/note/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(noteController.find).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 404 when note is not found', async () => {
      const id = new Id().value;
      noteController.find.mockResolvedValue(null as any);

      const response = await supertest(app).get(`/note/${id}`);

      expect(response.statusCode).toBe(404);
      expect(noteController.find).toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for invalid data on create', async () => {
      const response = await supertest(app).post('/note').send({});

      expect(response.statusCode).toBe(400);
      expect(noteController.create).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 400 for missing id on update', async () => {
      const response = await supertest(app).patch('/note').send({ note: 8.75 });

      expect(response.statusCode).toBe(400);
      expect(noteController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 422 for invalid id on update', async () => {
      const response = await supertest(app)
        .patch('/note')
        .send({ id: 'invalid-id', note: 8.75 });

      expect(response.statusCode).toBe(422);
      expect(noteController.update).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });

    it('should return 422 for invalid id on delete', async () => {
      const response = await supertest(app).delete('/note/invalid-id');

      expect(response.statusCode).toBe(422);
      expect(noteController.delete).not.toHaveBeenCalled();
      expect(response.body).toEqual({
        code: expect.any(String),
        message: expect.any(String),
        details: expect.any(Object),
      });
    });
  });
});
