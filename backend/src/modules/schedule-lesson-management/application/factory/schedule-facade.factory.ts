import MemoryScheduleRepository from '../../infrastructure/repositories/memory-repository/schedule.repository';
import ScheduleFacade from '../facade/facade/schedule.facade';
import AddLessons from '../usecases/schedule/addLessons.usecase';
import CreateSchedule from '../usecases/schedule/createSchedule.usecase';
import DeleteSchedule from '../usecases/schedule/deleteSchedule.usecase';
import FindAllSchedule from '../usecases/schedule/findAllSchedule.usecase';
import FindSchedule from '../usecases/schedule/findSchedule.usecase';
import RemoveLessons from '../usecases/schedule/removeLessons.usecase';
import UpdateSchedule from '../usecases/schedule/updateSchedule.usecase';

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
