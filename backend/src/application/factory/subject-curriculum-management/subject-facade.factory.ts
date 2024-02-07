import SubjectFacade from '@/application/facade/subject-curriculum-management/facade/subject.facade';
import CreateSubject from '@/application/usecases/subject-curriculum-management/subject/createSubject.usecase';
import DeleteSubject from '@/application/usecases/subject-curriculum-management/subject/deleteSubject.usecase';
import FindAllSubject from '@/application/usecases/subject-curriculum-management/subject/findAllSubject.usecase';
import FindSubject from '@/application/usecases/subject-curriculum-management/subject/findSubject.usecase';
import UpdateSubject from '@/application/usecases/subject-curriculum-management/subject/updateSubject.usecase';
import MemorySubjectRepository from '@/infraestructure/repositories/subject-curriculum-management/memory-repository/subject.repository';

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
