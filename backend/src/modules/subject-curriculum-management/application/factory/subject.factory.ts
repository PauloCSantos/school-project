import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import SubjectFacade from '../facade/facade/subject.facade';
import CreateSubject from '../usecases/subject/create.usecase';
import DeleteSubject from '../usecases/subject/delete.usecase';
import FindAllSubject from '../usecases/subject/find-all.usecase';
import FindSubject from '../usecases/subject/find.usecase';
import UpdateSubject from '../usecases/subject/update.usecase';
import SubjectGateway from '../gateway/subject.gateway';

export default class SubjectFacadeFactory {
  static create(
    repository: SubjectGateway,
    policiesService: PoliciesServiceInterface
  ): SubjectFacade {
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
