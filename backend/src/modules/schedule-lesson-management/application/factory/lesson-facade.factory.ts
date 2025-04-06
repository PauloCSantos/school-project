import MemoryLessonRepository from '../../infrastructure/repositories/memory-repository/lesson.repository';
import LessonFacade from '../facade/facade/lesson.facade';
import AddDay from '../usecases/lesson/addDay.usecase';
import AddStudents from '../usecases/lesson/addStudents.usecase';
import AddTime from '../usecases/lesson/addTime.usecase';
import CreateLesson from '../usecases/lesson/createLesson.usecase';
import DeleteLesson from '../usecases/lesson/deleteLesson.usecase';
import FindAllLesson from '../usecases/lesson/findAllLesson.usecase';
import FindLesson from '../usecases/lesson/findLesson.usecase';
import RemoveDay from '../usecases/lesson/removeDay.usecase';
import RemoveStudents from '../usecases/lesson/removeStudents.usecase';
import RemoveTime from '../usecases/lesson/removeTime.usecase';
import UpdateLesson from '../usecases/lesson/updateLesson.usecase';

export default class LessonFacadeFactory {
  static create(): LessonFacade {
    const repository = new MemoryLessonRepository();
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
