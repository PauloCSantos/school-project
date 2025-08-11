import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryEvaluationRepository from '../../infrastructure/repositories/memory-repository/evaluation.repository';
import EvaluationFacade from '../facade/facade/evaluation.facade';
import CreateEvaluation from '../usecases/evaluation/create.usecase';
import DeleteEvaluation from '../usecases/evaluation/delete.usecase';
import FindAllEvaluation from '../usecases/evaluation/find-all.usecase';
import FindEvaluation from '../usecases/evaluation/find.usecase';
import UpdateEvaluation from '../usecases/evaluation/update.usecase';

/**
 * Factory responsible for creating EvaluationFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class EvaluationFacadeFactory {
  /**
   * Creates an instance of EvaluationFacade with all dependencies properly configured
   * @returns Fully configured EvaluationFacade instance
   */
  static create(): EvaluationFacade {
    // Currently using memory repository only
    // Future implementation will use environment variables to determine repository type
    const repository = new MemoryEvaluationRepository();
    const policiesService = new PoliciesService();

    // Create all required use cases
    const createEvaluation = new CreateEvaluation(repository, policiesService);
    const deleteEvaluation = new DeleteEvaluation(repository, policiesService);
    const findAllEvaluation = new FindAllEvaluation(
      repository,
      policiesService
    );
    const findEvaluation = new FindEvaluation(repository, policiesService);
    const updateEvaluation = new UpdateEvaluation(repository, policiesService);

    // Instantiate and return the facade with all required use cases
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
