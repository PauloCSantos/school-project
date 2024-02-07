import EvaluationFacade from '@/application/facade/evaluation-note-attendance-management/facade/evaluation.facade';
import CreateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/createEvaluation.usecase';
import DeleteEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/deleteEvaluation.usecase';
import FindAllEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findAllEvaluation.usecase';
import FindEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/findEvaluation.usecase';
import UpdateEvaluation from '@/application/usecases/evaluation-note-attendance-management/evaluation/updateEvaluation.usecase';
import MemoryEvaluationRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/evaluation.repository';

export default class EvaluationFacadeFactory {
  static create(): EvaluationFacade {
    const repository = new MemoryEvaluationRepository();
    const createEvaluation = new CreateEvaluation(repository);
    const deleteEvaluation = new DeleteEvaluation(repository);
    const findAllEvaluation = new FindAllEvaluation(repository);
    const findEvaluation = new FindEvaluation(repository);
    const updateEvaluation = new UpdateEvaluation(repository);
    const facade = new EvaluationFacade({
      createEvaluation,
      deleteEvaluation,
      findAllEvaluation,
      findEvaluation,
      updateEvaluation,
    });

    return facade;
  }
}
