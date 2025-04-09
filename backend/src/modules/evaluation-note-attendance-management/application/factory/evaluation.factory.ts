import MemoryEvaluationRepository from '../../infrastructure/repositories/memory-repository/evaluation.repository';
import EvaluationFacade from '../facade/facade/evaluation.facade';
import CreateEvaluation from '../usecases/evaluation/create.usecase';
import DeleteEvaluation from '../usecases/evaluation/delete.usecase';
import FindAllEvaluation from '../usecases/evaluation/find-all.usecase';
import FindEvaluation from '../usecases/evaluation/find.usecase';
import UpdateEvaluation from '../usecases/evaluation/update.usecase';

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
