import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import MemoryNoteRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/note.repository';
import CreateNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/create.usecase';
import FindNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/find.usecase';
import FindAllNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/find-all.usecase';
import UpdateNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/update.usecase';
import DeleteNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/delete.usecase';
import NoteController from '@/modules/evaluation-note-attendance-management/interface/controller/note.controller';
import NoteRoute from '@/modules/evaluation-note-attendance-management/interface/route/note.route';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeNote(
  express: HttpServer,
  tokenService: TokenService,
  policiesService: PoliciesService,
  isProd: boolean
): void {
  const noteRepository = new MemoryNoteRepository();

  const createNoteUsecase = new CreateNote(noteRepository, policiesService);
  const findNoteUsecase = new FindNote(noteRepository, policiesService);
  const findAllNoteUsecase = new FindAllNote(noteRepository, policiesService);
  const updateNoteUsecase = new UpdateNote(noteRepository, policiesService);
  const deleteNoteUsecase = new DeleteNote(noteRepository, policiesService);

  const noteController = new NoteController(
    createNoteUsecase,
    findNoteUsecase,
    findAllNoteUsecase,
    updateNoteUsecase,
    deleteNoteUsecase
  );

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
