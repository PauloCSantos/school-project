import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import MemoryScheduleRepository from '../../infrastructure/repositories/memory-repository/schedule.repository';
import ScheduleFacade from '../facade/facade/schedule.facade';
import AddLessons from '../usecases/schedule/add-lessons.usecase';
import CreateSchedule from '../usecases/schedule/create.usecase';
import DeleteSchedule from '../usecases/schedule/delete.usecase';
import FindAllSchedule from '../usecases/schedule/find-all.usecase';
import FindSchedule from '../usecases/schedule/find.usecase';
import RemoveLessons from '../usecases/schedule/remove-lessons.usecase';
import UpdateSchedule from '../usecases/schedule/update.usecase';

/**
 * Factory responsible for creating ScheduleFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class ScheduleFacadeFactory {
  /**
   * Creates an instance of ScheduleFacade with all dependencies properly configured
   * @returns Fully configured ScheduleFacade instance
   */
  static create(): ScheduleFacade {
    // Currently using memory repository
    const repository = new MemoryScheduleRepository();
    const policiesService = new PoliciesService();

    // Create all required use cases
    const createSchedule = new CreateSchedule(repository);
    const deleteSchedule = new DeleteSchedule(repository);
    const findAllSchedule = new FindAllSchedule(repository);
    const findSchedule = new FindSchedule(repository);
    const updateSchedule = new UpdateSchedule(repository);
    const addLessons = new AddLessons(repository);
    const removeLessons = new RemoveLessons(repository);

    // Instantiate and return the facade with all required use cases
    const facade = new ScheduleFacade({
      createSchedule,
      deleteSchedule,
      findAllSchedule,
      findSchedule,
      updateSchedule,
      addLessons,
      removeLessons,
      policiesService,
    });

    return facade;
  }
}
