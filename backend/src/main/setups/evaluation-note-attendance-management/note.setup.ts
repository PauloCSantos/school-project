import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import CreateNote from '@/application/usecases/evaluation-note-attendance-management/note/createNote.usecase';
import DeleteNote from '@/application/usecases/evaluation-note-attendance-management/note/deleteNote.usecase';
import FindAllNote from '@/application/usecases/evaluation-note-attendance-management/note/findAllNote.usecase';
import FindNote from '@/application/usecases/evaluation-note-attendance-management/note/findNote.usecase';
import UpdateNote from '@/application/usecases/evaluation-note-attendance-management/note/updateNote.usecase';
import tokenInstance from '@/infraestructure/config/tokenService/token-service.instance';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryNoteRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/note.repository';
import { NoteController } from '@/interface/controller/evaluation-note-attendance-management/note.controller';
import { NoteRoute } from '@/interface/route/evaluation-note-attendance-management/note.route';

export default function initializeNote(express: ExpressHttp): void {
  const noteRepository = new MemoryNoteRepository();
  const createNoteUsecase = new CreateNote(noteRepository);
  const findNoteUsecase = new FindNote(noteRepository);
  const findAllNoteUsecase = new FindAllNote(noteRepository);
  const updateNoteUsecase = new UpdateNote(noteRepository);
  const deleteNoteUsecase = new DeleteNote(noteRepository);
  const noteController = new NoteController(
    createNoteUsecase,
    findNoteUsecase,
    findAllNoteUsecase,
    updateNoteUsecase,
    deleteNoteUsecase
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = [
    'master',
    'administrator',
    'student',
    'teacher',
    'worker',
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const noteRoute = new NoteRoute(noteController, express, authUserMiddleware);
  noteRoute.routes();
}
