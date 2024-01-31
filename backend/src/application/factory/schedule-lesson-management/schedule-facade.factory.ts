import ScheduleFacade from '@/application/facade/schedule-lesson-management/facade/schedule.facade';
import AddLessons from '@/application/usecases/schedule-lesson-management/schedule/addLessons.usecase';
import CreateSchedule from '@/application/usecases/schedule-lesson-management/schedule/createSchedule.usecase';
import DeleteSchedule from '@/application/usecases/schedule-lesson-management/schedule/deleteSchedule.usecase';
import FindAllSchedule from '@/application/usecases/schedule-lesson-management/schedule/findAllSchedule.usecase';
import FindSchedule from '@/application/usecases/schedule-lesson-management/schedule/findSchedule.usecase';
import RemoveLessons from '@/application/usecases/schedule-lesson-management/schedule/removeLessons.usecase';
import UpdateSchedule from '@/application/usecases/schedule-lesson-management/schedule/updateSchedule.usecase';
import MemoryScheduleRepository from '@/infraestructure/repositories/schedule-lesson-management/memory-repository/schedule.repository';

export default class ScheduleFacadeFactory {
  static create(): ScheduleFacade {
    const repository = new MemoryScheduleRepository();
    const createSchedule = new CreateSchedule(repository);
    const deleteSchedule = new DeleteSchedule(repository);
    const findAllSchedule = new FindAllSchedule(repository);
    const findSchedule = new FindSchedule(repository);
    const updateSchedule = new UpdateSchedule(repository);
    const addLessons = new AddLessons(repository);
    const removeLessons = new RemoveLessons(repository);
    const facade = new ScheduleFacade({
      createSchedule,
      deleteSchedule,
      findAllSchedule,
      findSchedule,
      updateSchedule,
      addLessons,
      removeLessons,
    });

    return facade;
  }
}
