import MemoryEventRepository from '../../infrastructure/repositories/memory-repository/calendar.repository';
import EventFacade from '../facade/facade/calendar.facade';
import CreateEvent from '../usecases/event/create.usecase';
import DeleteEvent from '../usecases/event/delete.usecase';
import FindAllEvent from '../usecases/event/find-all.usecase';
import FindEvent from '../usecases/event/find.usecase';
import UpdateEvent from '../usecases/event/update.usecase';

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
