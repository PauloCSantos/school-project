import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express-http';
import MemoryScheduleRepository from '@/modules/schedule-lesson-management/infrastructure/repositories/memory-repository/schedule.repository';
import CreateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/createSchedule.usecase';
import FindSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/findSchedule.usecase';
import FindAllSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/findAllSchedule.usecase';
import UpdateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/updateSchedule.usecase';
import DeleteSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/deleteSchedule.usecase';
import AddLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/addLessons.usecase';
import RemoveLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/removeLessons.usecase';
import { ScheduleController } from '@/modules/schedule-lesson-management/interface/controller/schedule.controller';
import { ScheduleRoute } from '@/modules/schedule-lesson-management/interface/route/schedule.route';

export default function initializeSchedule(express: ExpressHttp): void {
  const scheduleRepository = new MemoryScheduleRepository();
  const createScheduleUsecase = new CreateSchedule(scheduleRepository);
  const findScheduleUsecase = new FindSchedule(scheduleRepository);
  const findAllScheduleUsecase = new FindAllSchedule(scheduleRepository);
  const updateScheduleUsecase = new UpdateSchedule(scheduleRepository);
  const deleteScheduleUsecase = new DeleteSchedule(scheduleRepository);
  const addLessons = new AddLessons(scheduleRepository);
  const removeLessons = new RemoveLessons(scheduleRepository);
  const scheduleController = new ScheduleController(
    createScheduleUsecase,
    findScheduleUsecase,
    findAllScheduleUsecase,
    updateScheduleUsecase,
    deleteScheduleUsecase,
    addLessons,
    removeLessons
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = ['master', 'administrator'];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const scheduleRoute = new ScheduleRoute(
    scheduleController,
    express,
    authUserMiddleware
  );
  scheduleRoute.routes();
}
