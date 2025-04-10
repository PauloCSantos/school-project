import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';

import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import MemoryLessonRepository from '@/modules/schedule-lesson-management/infrastructure/repositories/memory-repository/lesson.repository';
import CreateLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/create.usecase';
import FindLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/find.usecase';
import FindAllLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/find-all.usecase';
import UpdateLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/update.usecase';
import DeleteLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/delete.usecase';
import AddStudents from '@/modules/schedule-lesson-management/application/usecases/lesson/add-students.usecase';
import RemoveStudents from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-students.usecase';
import AddDay from '@/modules/schedule-lesson-management/application/usecases/lesson/add-day.usecase';
import RemoveDay from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-day.usecase';
import AddTime from '@/modules/schedule-lesson-management/application/usecases/lesson/add-time.usecase';
import RemoveTime from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-time.usecase';
import { LessonController } from '@/modules/schedule-lesson-management/interface/controller/lesson.controller';
import { LessonRoute } from '@/modules/schedule-lesson-management/interface/route/lesson.route';

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
