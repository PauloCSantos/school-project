import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import MemoryEvaluationRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/evaluation.repository';
import CreateEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/create.usecase';
import FindEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/find.usecase';
import FindAllEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/find-all.usecase';
import UpdateEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/update.usecase';
import DeleteEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/delete.usecase';
import EvaluationController from '@/modules/evaluation-note-attendance-management/interface/controller/evaluation.controller';
import EvaluationRoute from '@/modules/evaluation-note-attendance-management/interface/route/evaluation.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeEvaluation(
  express: HttpServer,
  tokenService: TokenService,
  policiesService: PoliciesService,
  isProd: boolean
): void {
  const evaluationRepository = new MemoryEvaluationRepository();

  const createEvaluationUsecase = new CreateEvaluation(
    evaluationRepository,
    policiesService
  );
  const findEvaluationUsecase = new FindEvaluation(evaluationRepository, policiesService);
  const findAllEvaluationUsecase = new FindAllEvaluation(
    evaluationRepository,
    policiesService
  );
  const updateEvaluationUsecase = new UpdateEvaluation(
    evaluationRepository,
    policiesService
  );
  const deleteEvaluationUsecase = new DeleteEvaluation(
    evaluationRepository,
    policiesService
  );

  const evaluationController = new EvaluationController(
    createEvaluationUsecase,
    findEvaluationUsecase,
    findAllEvaluationUsecase,
    updateEvaluationUsecase,
    deleteEvaluationUsecase
  );

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const evaluationRoute = new EvaluationRoute(
    evaluationController,
    express,
    authUserMiddleware
  );
  evaluationRoute.routes();
}
