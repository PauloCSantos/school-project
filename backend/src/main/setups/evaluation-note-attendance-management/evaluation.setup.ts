import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import MemoryEvaluationRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/evaluation.repository';
import CreateEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/create.usecase';
import FindEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/find.usecase';
import FindAllEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/find-all.usecase';
import UpdateEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/update.usecase';
import DeleteEvaluation from '@/modules/evaluation-note-attendance-management/application/usecases/evaluation/delete.usecase';
import { EvaluationController } from '@/modules/evaluation-note-attendance-management/interface/controller/evaluation.controller';
import { EvaluationRoute } from '@/modules/evaluation-note-attendance-management/interface/route/evaluation.route';

export default function initializeEvaluation(express: ExpressHttp): void {
  const evaluationRepository = new MemoryEvaluationRepository();
  const createEvaluationUsecase = new CreateEvaluation(evaluationRepository);
  const findEvaluationUsecase = new FindEvaluation(evaluationRepository);
  const findAllEvaluationUsecase = new FindAllEvaluation(evaluationRepository);
  const updateEvaluationUsecase = new UpdateEvaluation(evaluationRepository);
  const deleteEvaluationUsecase = new DeleteEvaluation(evaluationRepository);
  const evaluationController = new EvaluationController(
    createEvaluationUsecase,
    findEvaluationUsecase,
    findAllEvaluationUsecase,
    updateEvaluationUsecase,
    deleteEvaluationUsecase
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = [
    'master',
    'administrator',
    'student',
    'teacher',
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const evaluationRoute = new EvaluationRoute(
    evaluationController,
    express,
    authUserMiddleware
  );
  evaluationRoute.routes();
}
