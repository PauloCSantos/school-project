import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import EventFacade from '../facade/facade/event.facade';
import CreateEvent from '../usecases/event/create.usecase';
import DeleteEvent from '../usecases/event/delete.usecase';
import FindAllEvent from '../usecases/event/find-all.usecase';
import FindEvent from '../usecases/event/find.usecase';
import UpdateEvent from '../usecases/event/update.usecase';
import EventGateway from '../gateway/event.gateway';

/**
 * Factory responsible for creating EventFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class EventFacadeFactory {
  /**
   * Creates an instance of EventFacade with all dependencies properly configured
   * @returns Fully configured EventFacade instance
   */
  static create(
    repository: EventGateway,
    policiesService: PoliciesServiceInterface
  ): EventFacade {
    const createEvent = new CreateEvent(repository, policiesService);
    const deleteEvent = new DeleteEvent(repository, policiesService);
    const findAllEvent = new FindAllEvent(repository, policiesService);
    const findEvent = new FindEvent(repository, policiesService);
    const updateEvent = new UpdateEvent(repository, policiesService);

    const facade = new EventFacade({
      createEvent,
      deleteEvent,
      findAllEvent,
      findEvent,
      updateEvent,
    });

    return facade;
  }
}
