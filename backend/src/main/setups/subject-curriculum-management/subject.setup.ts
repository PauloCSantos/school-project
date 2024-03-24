import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import CreateSubject from '@/application/usecases/subject-curriculum-management/subject/createSubject.usecase';
import DeleteSubject from '@/application/usecases/subject-curriculum-management/subject/deleteSubject.usecase';
import FindAllSubject from '@/application/usecases/subject-curriculum-management/subject/findAllSubject.usecase';
import FindSubject from '@/application/usecases/subject-curriculum-management/subject/findSubject.usecase';
import UpdateSubject from '@/application/usecases/subject-curriculum-management/subject/updateSubject.usecase';
import tokenInstance from '@/infraestructure/config/tokenService/token-service.instance';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemorySubjectRepository from '@/infraestructure/repositories/subject-curriculum-management/memory-repository/subject.repository';
import { SubjectController } from '@/interface/controller/subject-curriculum-management/subject.controller';
import { SubjectRoute } from '@/interface/route/subject-curriculum-management/subject.route';

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
