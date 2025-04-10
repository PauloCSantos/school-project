import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';

import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import MemoryEventRepository from '@/modules/event-calendar-management/infrastructure/repositories/memory-repository/calendar.repository';
import CreateEvent from '@/modules/event-calendar-management/application/usecases/event/create.usecase';
import FindEvent from '@/modules/event-calendar-management/application/usecases/event/find.usecase';
import FindAllEvent from '@/modules/event-calendar-management/application/usecases/event/find-all.usecase';
import UpdateEvent from '@/modules/event-calendar-management/application/usecases/event/update.usecase';
import DeleteEvent from '@/modules/event-calendar-management/application/usecases/event/delete.usecase';
import { EventController } from '@/modules/event-calendar-management/interface/controller/calendar.controller';
import { EventRoute } from '@/modules/event-calendar-management/interface/route/calendar.route';

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
