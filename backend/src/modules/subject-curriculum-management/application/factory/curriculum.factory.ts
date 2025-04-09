import CreateCurriculum from '../usecases/curriculum/create.usecase';
import DeleteCurriculum from '../usecases/curriculum/delete.usecase';
import FindAllCurriculum from '../usecases/curriculum/find-all.usecase';
import FindCurriculum from '../usecases/curriculum/find.usecase';
import RemoveSubjects from '../usecases/curriculum/remove-subjects.usecase';
import UpdateCurriculum from '../usecases/curriculum/update.usecase';
import CurriculumFacade from '../facade/facade/curriculum.facade';
import AddSubjects from '../usecases/curriculum/add-subjects.usecase';
import MemoryCurriculumRepository from '../../infrastructure/repositories/memory-repository/curriculum.repository';

export default class CurriculumFacadeFactory {
  static create(): CurriculumFacade {
    const repository = new MemoryCurriculumRepository();
    const createCurriculum = new CreateCurriculum(repository);
    const deleteCurriculum = new DeleteCurriculum(repository);
    const findAllCurriculum = new FindAllCurriculum(repository);
    const findCurriculum = new FindCurriculum(repository);
    const updateCurriculum = new UpdateCurriculum(repository);
    const addSubjects = new AddSubjects(repository);
    const removeSubjects = new RemoveSubjects(repository);
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
