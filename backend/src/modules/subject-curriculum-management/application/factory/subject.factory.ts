import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
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
    const policiesService = new PoliciesService();

    const createSubject = new CreateSubject(repository, policiesService);
    const deleteSubject = new DeleteSubject(repository, policiesService);
    const findAllSubject = new FindAllSubject(repository, policiesService);
    const findSubject = new FindSubject(repository, policiesService);
    const updateSubject = new UpdateSubject(repository, policiesService);
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
