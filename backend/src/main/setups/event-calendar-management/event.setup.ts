import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';

import tokenInstance from '@/main/config/tokenService/token-service.instance';
import MemoryEventRepository from '@/modules/event-calendar-management/infrastructure/repositories/memory-repository/event.repository';
import CreateEvent from '@/modules/event-calendar-management/application/usecases/event/create.usecase';
import FindEvent from '@/modules/event-calendar-management/application/usecases/event/find.usecase';
import FindAllEvent from '@/modules/event-calendar-management/application/usecases/event/find-all.usecase';
import UpdateEvent from '@/modules/event-calendar-management/application/usecases/event/update.usecase';
import DeleteEvent from '@/modules/event-calendar-management/application/usecases/event/delete.usecase';
import EventController from '@/modules/event-calendar-management/interface/controller/event.controller';
import EventRoute from '@/modules/event-calendar-management/interface/route/event.route';
import { RoleUsers, RoleUsersEnum } from '@/modules/@shared/type/enum';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';

export default function initializeEvent(express: HttpServer): void {
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
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
    RoleUsersEnum.WORKER,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const eventRoute = new EventRoute(
    eventController,
    express,
    authUserMiddleware
  );
  eventRoute.routes();
}
