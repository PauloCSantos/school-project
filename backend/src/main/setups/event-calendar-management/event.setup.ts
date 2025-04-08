import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';

import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import MemoryEventRepository from '@/modules/event-calendar-management/infrastructure/repositories/memory-repository/event.repository';
import CreateEvent from '@/modules/event-calendar-management/application/usecases/event/createEvent.usecase';
import FindEvent from '@/modules/event-calendar-management/application/usecases/event/findEvent.usecase';
import FindAllEvent from '@/modules/event-calendar-management/application/usecases/event/findAllEvent.usecase';
import UpdateEvent from '@/modules/event-calendar-management/application/usecases/event/updateEvent.usecase';
import DeleteEvent from '@/modules/event-calendar-management/application/usecases/event/deleteEvent.usecase';
import { EventController } from '@/modules/event-calendar-management/interface/controller/event.controller';
import { EventRoute } from '@/modules/event-calendar-management/interface/route/event.route';

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
