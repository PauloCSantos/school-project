import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import MemoryCurriculumRepository from '@/modules/subject-curriculum-management/infrastructure/repositories/memory-repository/curriculum.repository';
import CreateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/create.usecase';
import FindCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/find.usecase';
import FindAllCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/find-all.usecase';
import UpdateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/update.usecase';
import DeleteCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/delete.usecase';
import AddSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/add-subjects.usecase';
import RemoveSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/remove-subjects.usecase';
import { CurriculumController } from '@/modules/subject-curriculum-management/interface/controller/curriculum.controller';
import { CurriculumRoute } from '@/modules/subject-curriculum-management/interface/route/curriculum.route';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeCurriculum(
  express: HttpServer,
  tokenService: TokenService,
  policiesService: PoliciesService,
  isProd: boolean
): void {
  const curriculumRepository = new MemoryCurriculumRepository();

  const createCurriculumUsecase = new CreateCurriculum(
    curriculumRepository,
    policiesService
  );
  const findCurriculumUsecase = new FindCurriculum(curriculumRepository, policiesService);
  const findAllCurriculumUsecase = new FindAllCurriculum(
    curriculumRepository,
    policiesService
  );
  const updateCurriculumUsecase = new UpdateCurriculum(
    curriculumRepository,
    policiesService
  );
  const deleteCurriculumUsecase = new DeleteCurriculum(
    curriculumRepository,
    policiesService
  );
  const addSubjects = new AddSubjects(curriculumRepository, policiesService);
  const removeSubjects = new RemoveSubjects(curriculumRepository, policiesService);

  const curriculumController = new CurriculumController(
    createCurriculumUsecase,
    findCurriculumUsecase,
    findAllCurriculumUsecase,
    updateCurriculumUsecase,
    deleteCurriculumUsecase,
    addSubjects,
    removeSubjects
  );

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const curriculumRoute = new CurriculumRoute(
    curriculumController,
    express,
    authUserMiddleware
  );
  curriculumRoute.routes();
}
