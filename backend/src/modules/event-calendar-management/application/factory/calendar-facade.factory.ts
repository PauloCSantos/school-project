import MemoryEventRepository from '../../infrastructure/repositories/memory-repository/calendar.repository';
import EventFacade from '../facade/facade/calendar.facade';
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

    // Create all required use cases
    const createEvent = new CreateEvent(repository);
    const deleteEvent = new DeleteEvent(repository);
    const findAllEvent = new FindAllEvent(repository);
    const findEvent = new FindEvent(repository);
    const updateEvent = new UpdateEvent(repository);

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
