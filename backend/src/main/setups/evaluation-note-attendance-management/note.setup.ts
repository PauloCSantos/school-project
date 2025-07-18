import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import MemoryNoteRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/note.repository';
import CreateNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/create.usecase';
import FindNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/find.usecase';
import FindAllNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/find-all.usecase';
import UpdateNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/update.usecase';
import DeleteNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/delete.usecase';
import NoteController from '@/modules/evaluation-note-attendance-management/interface/controller/note.controller';
import NoteRoute from '@/modules/evaluation-note-attendance-management/interface/route/note.route';
import { RoleUsers, RoleUsersEnum } from '@/modules/@shared/type/sharedTypes';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';

export default function initializeNote(express: HttpServer): void {
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
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const noteRoute = new NoteRoute(noteController, express, authUserMiddleware);
  noteRoute.routes();
}
