import EventFacade from '@/application/facade/event-calendar-management/facade/event.facade';
import CreateEvent from '@/application/usecases/event-calendar-management/event/createEvent.usecase';
import DeleteEvent from '@/application/usecases/event-calendar-management/event/deleteEvent.usecase';
import FindAllEvent from '@/application/usecases/event-calendar-management/event/findAllEvent.usecase';
import FindEvent from '@/application/usecases/event-calendar-management/event/findEvent.usecase';
import UpdateEvent from '@/application/usecases/event-calendar-management/event/updateEvent.usecase';
import MemoryEventRepository from '@/infraestructure/repositories/event-calendar-management/memory-repository/event.repository';

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
