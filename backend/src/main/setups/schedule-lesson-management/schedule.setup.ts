import AddLessons from '@/application/usecases/schedule-lesson-management/schedule/addLessons.usecase';
import CreateSchedule from '@/application/usecases/schedule-lesson-management/schedule/createSchedule.usecase';
import DeleteSchedule from '@/application/usecases/schedule-lesson-management/schedule/deleteSchedule.usecase';
import FindAllSchedule from '@/application/usecases/schedule-lesson-management/schedule/findAllSchedule.usecase';
import FindSchedule from '@/application/usecases/schedule-lesson-management/schedule/findSchedule.usecase';
import RemoveLessons from '@/application/usecases/schedule-lesson-management/schedule/removeLessons.usecase';
import UpdateSchedule from '@/application/usecases/schedule-lesson-management/schedule/updateSchedule.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryScheduleRepository from '@/infraestructure/repositories/schedule-lesson-management/memory-repository/schedule.repository';
import { ScheduleController } from '@/interface/controller/schedule-lesson-management/schedule.controller';
import { ScheduleRoute } from '@/interface/route/schedule-lesson-management/schedule.route';

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
  const scheduleRoute = new ScheduleRoute(scheduleController, express);
  scheduleRoute.routes();
}
