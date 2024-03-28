import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import CreateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/createEvaluation.usecase';
import DeleteEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/deleteEvaluation.usecase';
import FindAllEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findAllEvaluation.usecase';
import FindEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findEvaluation.usecase';
import UpdateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/updateEvaluation.usecase';
import tokenInstance from '@/infraestructure/config/tokenService/token-service.instance';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryEvaluationRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/evaluation.repository';
import { EvaluationController } from '@/interface/controller/evaluation-note-attendance-management/evaluation.controller';
import { EvaluationRoute } from '@/interface/route/evaluation-note-attendance-management/evaluation.route';

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
