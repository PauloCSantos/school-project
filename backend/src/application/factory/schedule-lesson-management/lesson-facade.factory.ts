import LessonFacade from '@/application/facade/schedule-lesson-management/facade/lesson.facade';
import AddDay from '@/application/usecases/schedule-lesson-management/lesson/addDay.usecase';
import AddStudents from '@/application/usecases/schedule-lesson-management/lesson/addStudents.usecase';
import AddTime from '@/application/usecases/schedule-lesson-management/lesson/addTime.usecase';
import CreateLesson from '@/application/usecases/schedule-lesson-management/lesson/createLesson.usecase';
import DeleteLesson from '@/application/usecases/schedule-lesson-management/lesson/deleteLesson.usecase';
import FindAllLesson from '@/application/usecases/schedule-lesson-management/lesson/findAllLesson.usecase';
import FindLesson from '@/application/usecases/schedule-lesson-management/lesson/findLesson.usecase';
import RemoveDay from '@/application/usecases/schedule-lesson-management/lesson/removeDay.usecase';
import RemoveStudents from '@/application/usecases/schedule-lesson-management/lesson/removeStudents.usecase';
import RemoveTime from '@/application/usecases/schedule-lesson-management/lesson/removeTime.usecase';
import UpdateLesson from '@/application/usecases/schedule-lesson-management/lesson/updateLesson.usecase';
import MemoryLessonRepository from '@/infraestructure/repositories/schedule-lesson-management/memory-repository/lesson.repository';

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
