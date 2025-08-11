import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryEventRepository from '../../infrastructure/repositories/memory-repository/event.repository';
import EventFacade from '../facade/facade/event.facade';
import CreateEvent from '../usecases/event/create.usecase';
import DeleteEvent from '../usecases/event/delete.usecase';
import FindAllEvent from '../usecases/event/find-all.usecase';
import FindEvent from '../usecases/event/find.usecase';
import UpdateEvent from '../usecases/event/update.usecase';

/**
 * Factory responsible for creating EventFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class EventFacadeFactory {
  /**
   * Creates an instance of EventFacade with all dependencies properly configured
   * @returns Fully configured EventFacade instance
   */
  static create(): EventFacade {
    // Currently using memory repository only
    // Future implementation will use environment variables to determine repository type
    const repository = new MemoryEventRepository();
    const policiesService = new PoliciesService();

    // Create all required use cases
    const createEvent = new CreateEvent(repository, policiesService);
    const deleteEvent = new DeleteEvent(repository, policiesService);
    const findAllEvent = new FindAllEvent(repository, policiesService);
    const findEvent = new FindEvent(repository, policiesService);
    const updateEvent = new UpdateEvent(repository, policiesService);

    // Instantiate and return the facade with all required use cases
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
