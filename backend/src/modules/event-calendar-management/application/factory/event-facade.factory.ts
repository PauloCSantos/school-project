import MemoryEventRepository from '../../infrastructure/repositories/memory-repository/event.repository';
import EventFacade from '../facade/facade/event.facade';
import CreateEvent from '../usecases/event/createEvent.usecase';
import DeleteEvent from '../usecases/event/deleteEvent.usecase';
import FindAllEvent from '../usecases/event/findAllEvent.usecase';
import FindEvent from '../usecases/event/findEvent.usecase';
import UpdateEvent from '../usecases/event/updateEvent.usecase';

export default class EventFacadeFactory {
  static create(): EventFacade {
    const repository = new MemoryEventRepository();
    const createEvent = new CreateEvent(repository);
    const deleteEvent = new DeleteEvent(repository);
    const findAllEvent = new FindAllEvent(repository);
    const findEvent = new FindEvent(repository);
    const updateEvent = new UpdateEvent(repository);
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
