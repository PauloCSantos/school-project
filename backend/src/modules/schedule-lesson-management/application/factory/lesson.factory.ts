import MemoryLessonRepository from '../../infrastructure/repositories/memory-repository/lesson.repository';
import LessonFacade from '../facade/facade/lesson.facade';
import AddDay from '../usecases/lesson/add-day.usecase';
import AddStudents from '../usecases/lesson/add-students.usecase';
import AddTime from '../usecases/lesson/add-time.usecase';
import CreateLesson from '../usecases/lesson/create.usecase';
import DeleteLesson from '../usecases/lesson/delete.usecase';
import FindAllLesson from '../usecases/lesson/find-all.usecase';
import FindLesson from '../usecases/lesson/find.usecase';
import RemoveDay from '../usecases/lesson/remove-day.usecase';
import RemoveStudents from '../usecases/lesson/remove-students.usecase';
import RemoveTime from '../usecases/lesson/remove-time.usecase';
import UpdateLesson from '../usecases/lesson/update.usecase';

/**
 * Factory responsible for creating LessonFacade instances
 * Currently uses memory repository, but prepared for future extension
 */
export default class LessonFacadeFactory {
  /**
   * Creates an instance of LessonFacade with all dependencies properly configured
   * @returns Fully configured LessonFacade instance
   */
  static create(): LessonFacade {
    // Currently using memory repository
    const repository = new MemoryLessonRepository();

    // Create all required use cases
    const createLesson = new CreateLesson(repository);
    const deleteLesson = new DeleteLesson(repository);
    const findAllLesson = new FindAllLesson(repository);
    const findLesson = new FindLesson(repository);
    const updateLesson = new UpdateLesson(repository);
    const addStudents = new AddStudents(repository);
    const removeStudents = new RemoveStudents(repository);
    const addDay = new AddDay(repository);
    const removeDay = new RemoveDay(repository);
    const addTime = new AddTime(repository);
    const removeTime = new RemoveTime(repository);

    // Instantiate and return the facade with all required use cases
    const facade = new LessonFacade({
      createLesson,
      deleteLesson,
      findAllLesson,
      findLesson,
      updateLesson,
      addStudents,
      removeStudents,
      addDay,
      removeDay,
      addTime,
      removeTime,
    });

    return facade;
  }
}
