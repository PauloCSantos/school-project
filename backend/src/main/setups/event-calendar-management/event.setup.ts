import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import MemoryEventRepository from '@/modules/event-calendar-management/infrastructure/repositories/memory-repository/event.repository';
import CreateEvent from '@/modules/event-calendar-management/application/usecases/event/create.usecase';
import FindEvent from '@/modules/event-calendar-management/application/usecases/event/find.usecase';
import FindAllEvent from '@/modules/event-calendar-management/application/usecases/event/find-all.usecase';
import UpdateEvent from '@/modules/event-calendar-management/application/usecases/event/update.usecase';
import DeleteEvent from '@/modules/event-calendar-management/application/usecases/event/delete.usecase';
import EventController from '@/modules/event-calendar-management/interface/controller/event.controller';
import EventRoute from '@/modules/event-calendar-management/interface/route/event.route';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeEvent(
  express: HttpServer,
  tokenService: TokenService,
  policiesService: PoliciesService,
  isProd: boolean
): void {
  const eventRepository = new MemoryEventRepository();

  const createEventUsecase = new CreateEvent(eventRepository, policiesService);
  const findEventUsecase = new FindEvent(eventRepository, policiesService);
  const findAllEventUsecase = new FindAllEvent(eventRepository, policiesService);
  const updateEventUsecase = new UpdateEvent(eventRepository, policiesService);
  const deleteEventUsecase = new DeleteEvent(eventRepository, policiesService);

  const eventController = new EventController(
    createEventUsecase,
    findEventUsecase,
    findAllEventUsecase,
    updateEventUsecase,
    deleteEventUsecase
  );

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
    RoleUsersEnum.WORKER,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const eventRoute = new EventRoute(eventController, express, authUserMiddleware);
  eventRoute.routes();
}
