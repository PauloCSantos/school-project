import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import MemorySubjectRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/subject.repository';
import CreateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/create.usecase';
import FindSubject from '@/modules/subject-curriculum-management/application/usecases/subject/find.usecase';
import FindAllSubject from '@/modules/subject-curriculum-management/application/usecases/subject/find-all.usecase';
import UpdateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/update.usecase';
import DeleteSubject from '@/modules/subject-curriculum-management/application/usecases/subject/delete.usecase';
import { SubjectController } from '@/modules/subject-curriculum-management/interface/controller/subject.controller';
import { SubjectRoute } from '@/modules/subject-curriculum-management/interface/route/subject.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeSubject(
  express: HttpServer,
  tokenService: TokenService,
  policiesService: PoliciesService,
  isProd: boolean
): void {
  const subjectRepository = new MemorySubjectRepository();

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

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const subjectRoute = new SubjectRoute(subjectController, express, authUserMiddleware);
  subjectRoute.routes();
}
