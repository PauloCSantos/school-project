import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import MemoryScheduleRepository from '@/modules/schedule-lesson-management/infrastructure/repositories/memory-repository/schedule.repository';
import CreateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/create.usecase';
import FindSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/find.usecase';
import FindAllSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/find-all.usecase';
import UpdateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/update.usecase';
import DeleteSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/delete.usecase';
import AddLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/add-lessons.usecase';
import RemoveLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/remove-lessons.usecase';
import { ScheduleController } from '@/modules/schedule-lesson-management/interface/controller/schedule.controller';
import ScheduleRoute from '@/modules/schedule-lesson-management/interface/route/schedule.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeSchedule(
  express: HttpServer,
  tokenService: TokenService,
  policiesService: PoliciesService,
  isProd: boolean
): void {
  const scheduleRepository = new MemoryScheduleRepository();

  const createScheduleUsecase = new CreateSchedule(scheduleRepository, policiesService);
  const findScheduleUsecase = new FindSchedule(scheduleRepository, policiesService);
  const findAllScheduleUsecase = new FindAllSchedule(scheduleRepository, policiesService);
  const updateScheduleUsecase = new UpdateSchedule(scheduleRepository, policiesService);
  const deleteScheduleUsecase = new DeleteSchedule(scheduleRepository, policiesService);
  const addLessons = new AddLessons(scheduleRepository, policiesService);
  const removeLessons = new RemoveLessons(scheduleRepository, policiesService);

  const scheduleController = new ScheduleController(
    createScheduleUsecase,
    findScheduleUsecase,
    findAllScheduleUsecase,
    updateScheduleUsecase,
    deleteScheduleUsecase,
    addLessons,
    removeLessons
  );

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const scheduleRoute = new ScheduleRoute(
    scheduleController,
    express,
    authUserMiddleware
  );
  scheduleRoute.routes();
}
