import MemorySubjectRepository from '../../infrastructure/repositories/memory-repository/subject.repository';
import SubjectFacade from '../facade/facade/subject.facade';
import CreateSubject from '../usecases/subject/create.usecase';
import DeleteSubject from '../usecases/subject/delete.usecase';
import FindAllSubject from '../usecases/subject/find-all.usecase';
import FindSubject from '../usecases/subject/find.usecase';
import UpdateSubject from '../usecases/subject/update.usecase';

export default class SubjectFacadeFactory {
  static create(): SubjectFacade {
    const repository = new MemorySubjectRepository();
    const createSubject = new CreateSubject(repository);
    const deleteSubject = new DeleteSubject(repository);
    const findAllSubject = new FindAllSubject(repository);
    const findSubject = new FindSubject(repository);
    const updateSubject = new UpdateSubject(repository);
    const facade = new SubjectFacade({
      createSubject,
      deleteSubject,
      findAllSubject,
      findSubject,
      updateSubject,
    });

    return facade;
  }
}
