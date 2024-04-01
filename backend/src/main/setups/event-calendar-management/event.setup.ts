import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import CreateEvent from '@/application/usecases/event-calendar-management/event/createEvent.usecase';
import DeleteEvent from '@/application/usecases/event-calendar-management/event/deleteEvent.usecase';
import FindAllEvent from '@/application/usecases/event-calendar-management/event/findAllEvent.usecase';
import FindEvent from '@/application/usecases/event-calendar-management/event/findEvent.usecase';
import UpdateEvent from '@/application/usecases/event-calendar-management/event/updateEvent.usecase';
import tokenInstance from '@/infraestructure/config/tokenService/token-service.instance';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryEventRepository from '@/infraestructure/repositories/event-calendar-management/memory-repository/event.repository';
import { EventController } from '@/interface/controller/event-calendar-management/event.controller';
import { EventRoute } from '@/interface/route/event-calendar-management/event.route';

export default function initializeEvent(express: ExpressHttp): void {
  const eventRepository = new MemoryEventRepository();
  const createEventUsecase = new CreateEvent(eventRepository);
  const findEventUsecase = new FindEvent(eventRepository);
  const findAllEventUsecase = new FindAllEvent(eventRepository);
  const updateEventUsecase = new UpdateEvent(eventRepository);
  const deleteEventUsecase = new DeleteEvent(eventRepository);
  const eventController = new EventController(
    createEventUsecase,
    findEventUsecase,
    findAllEventUsecase,
    updateEventUsecase,
    deleteEventUsecase
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = [
    'master',
    'administrator',
    'student',
    'teacher',
    'worker',
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const eventRoute = new EventRoute(
    eventController,
    express,
    authUserMiddleware
  );
  eventRoute.routes();
}
