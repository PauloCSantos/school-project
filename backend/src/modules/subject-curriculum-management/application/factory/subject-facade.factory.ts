import MemorySubjectRepository from '../../infrastructure/repositories/memory-repository/subject.repository';
import SubjectFacade from '../facade/facade/subject.facade';
import CreateSubject from '../usecases/subject/createSubject.usecase';
import DeleteSubject from '../usecases/subject/deleteSubject.usecase';
import FindAllSubject from '../usecases/subject/findAllSubject.usecase';
import FindSubject from '../usecases/subject/findSubject.usecase';
import UpdateSubject from '../usecases/subject/updateSubject.usecase';

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
