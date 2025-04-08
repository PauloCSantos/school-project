import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import MemoryCurriculumRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/curriculum.repository';
import CreateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/createCurriculum.usecase';
import FindCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/findCurriculum.usecase';
import FindAllCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/findAllCurriculum.usecase';
import UpdateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/updateCurriculum.usecase';
import DeleteCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/deleteCurriculum.usecase';
import AddSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/addSubjects.usecase';
import RemoveSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/removeSubjects.usecase';
import { CurriculumController } from '@/modules/subject-curriculum-management/interface/controller/curriculum.controller';
import { CurriculumRoute } from '@/modules/subject-curriculum-management/interface/route/curriculum.route';

export default function initializeCurriculum(express: ExpressHttp): void {
  const curriculumRepository = new MemoryCurriculumRepository();
  const createCurriculumUsecase = new CreateCurriculum(curriculumRepository);
  const findCurriculumUsecase = new FindCurriculum(curriculumRepository);
  const findAllCurriculumUsecase = new FindAllCurriculum(curriculumRepository);
  const updateCurriculumUsecase = new UpdateCurriculum(curriculumRepository);
  const deleteCurriculumUsecase = new DeleteCurriculum(curriculumRepository);
  const addSubjects = new AddSubjects(curriculumRepository);
  const removeSubjects = new RemoveSubjects(curriculumRepository);
  const curriculumController = new CurriculumController(
    createCurriculumUsecase,
    findCurriculumUsecase,
    findAllCurriculumUsecase,
    updateCurriculumUsecase,
    deleteCurriculumUsecase,
    addSubjects,
    removeSubjects
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = ['master', 'administrator'];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const curriculumRoute = new CurriculumRoute(
    curriculumController,
    express,
    authUserMiddleware
  );
  curriculumRoute.routes();
}
