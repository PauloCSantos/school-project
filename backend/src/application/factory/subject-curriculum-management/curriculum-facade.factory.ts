import CurriculumFacade from '@/application/facade/subject-curriculum-management/facade/curriculum.facade';
import AddSubjects from '@/application/usecases/subject-curriculum-management/curriculum/addSubjects.usecase';
import CreateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/createCurriculum.usecase';
import DeleteCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/deleteCurriculum.usecase';
import FindAllCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findAllCurriculum.usecase';
import FindCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/findCurriculum.usecase';
import RemoveSubjects from '@/application/usecases/subject-curriculum-management/curriculum/removeSubjects.usecase';
import UpdateCurriculum from '@/application/usecases/subject-curriculum-management/curriculum/updateCurriculum.usecase';
import MemoryCurriculumRepository from '@/infraestructure/repositories/subject-curriculum-management/memory-repository/curriculum.repository';

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
