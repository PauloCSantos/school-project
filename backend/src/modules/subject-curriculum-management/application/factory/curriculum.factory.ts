import CreateCurriculum from '../usecases/curriculum/create.usecase';
import DeleteCurriculum from '../usecases/curriculum/delete.usecase';
import FindAllCurriculum from '../usecases/curriculum/find-all.usecase';
import FindCurriculum from '../usecases/curriculum/find.usecase';
import RemoveSubjects from '../usecases/curriculum/remove-subjects.usecase';
import UpdateCurriculum from '../usecases/curriculum/update.usecase';
import CurriculumFacade from '../facade/facade/curriculum.facade';
import AddSubjects from '../usecases/curriculum/add-subjects.usecase';
import MemoryCurriculumRepository from '../../infrastructure/repositories/memory-repository/curriculum.repository';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';

export default class CurriculumFacadeFactory {
  static create(): CurriculumFacade {
    const repository = new MemoryCurriculumRepository();
    const policiesService = new PoliciesService();

    const createCurriculum = new CreateCurriculum(repository, policiesService);
    const deleteCurriculum = new DeleteCurriculum(repository, policiesService);
    const findAllCurriculum = new FindAllCurriculum(
      repository,
      policiesService
    );
    const findCurriculum = new FindCurriculum(repository, policiesService);
    const updateCurriculum = new UpdateCurriculum(repository, policiesService);
    const addSubjects = new AddSubjects(repository, policiesService);
    const removeSubjects = new RemoveSubjects(repository, policiesService);
    const facade = new CurriculumFacade({
      createCurriculum,
      deleteCurriculum,
      findAllCurriculum,
      findCurriculum,
      updateCurriculum,
      addSubjects,
      removeSubjects,
    });

    return facade;
  }
}
