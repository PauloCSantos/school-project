import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
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
import tokenInstance from '@/infraestructure/config/tokenService/token-service.instance';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryLessonRepository from '@/infraestructure/repositories/schedule-lesson-management/memory-repository/lesson.repository';
import { LessonController } from '@/interface/controller/schedule-lesson-management/lesson.controller';
import { LessonRoute } from '@/interface/route/schedule-lesson-management/lesson.route';

export default function initializeLesson(express: ExpressHttp): void {
  const lessonRepository = new MemoryLessonRepository();
  const createLessonUsecase = new CreateLesson(lessonRepository);
  const findLessonUsecase = new FindLesson(lessonRepository);
  const findAllLessonUsecase = new FindAllLesson(lessonRepository);
  const updateLessonUsecase = new UpdateLesson(lessonRepository);
  const deleteLessonUsecase = new DeleteLesson(lessonRepository);
  const addStudents = new AddStudents(lessonRepository);
  const removeStudents = new RemoveStudents(lessonRepository);
  const addDay = new AddDay(lessonRepository);
  const removeDay = new RemoveDay(lessonRepository);
  const addTime = new AddTime(lessonRepository);
  const removeTime = new RemoveTime(lessonRepository);
  const lessonController = new LessonController(
    createLessonUsecase,
    findLessonUsecase,
    findAllLessonUsecase,
    updateLessonUsecase,
    deleteLessonUsecase,
    addStudents,
    removeStudents,
    addDay,
    removeDay,
    addTime,
    removeTime
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = ['master', 'administrator'];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const lessonRoute = new LessonRoute(
    lessonController,
    express,
    authUserMiddleware
  );
  lessonRoute.routes();
}
