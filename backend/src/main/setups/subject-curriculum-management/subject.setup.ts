import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import { ExpressAdapter } from '@/modules/@shared/infraestructure/http/express.adapter';
import MemorySubjectRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/subject.repository';
import CreateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/create.usecase';
import FindSubject from '@/modules/subject-curriculum-management/application/usecases/subject/find.usecase';
import FindAllSubject from '@/modules/subject-curriculum-management/application/usecases/subject/find-all.usecase';
import UpdateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/update.usecase';
import DeleteSubject from '@/modules/subject-curriculum-management/application/usecases/subject/delete.usecase';
import { SubjectController } from '@/modules/subject-curriculum-management/interface/controller/subject.controller';
import { SubjectRoute } from '@/modules/subject-curriculum-management/interface/route/subject.route';

export default function initializeSubject(express: ExpressHttp): void {
  const subjectRepository = new MemorySubjectRepository();
  const createSubjectUsecase = new CreateSubject(subjectRepository);
  const findSubjectUsecase = new FindSubject(subjectRepository);
  const findAllSubjectUsecase = new FindAllSubject(subjectRepository);
  const updateSubjectUsecase = new UpdateSubject(subjectRepository);
  const deleteSubjectUsecase = new DeleteSubject(subjectRepository);
  const subjectController = new SubjectController(
    createSubjectUsecase,
    findSubjectUsecase,
    findAllSubjectUsecase,
    updateSubjectUsecase,
    deleteSubjectUsecase
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = ['master', 'administrator'];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const subjectRoute = new SubjectRoute(
    subjectController,
    express,
    authUserMiddleware
  );
  subjectRoute.routes();
}
