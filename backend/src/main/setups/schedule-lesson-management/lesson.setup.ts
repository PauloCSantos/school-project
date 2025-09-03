import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
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
import LessonRoute from '@/modules/schedule-lesson-management/interface/route/lesson.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers } from '@/modules/@shared/type/sharedTypes';
import TokenService from '@/modules/authentication-authorization-management/infrastructure/services/token.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

export default function initializeLesson(
  express: HttpServer,
  tokenService: TokenService,
  policiesService: PoliciesService,
  isProd: boolean
): void {
  const lessonRepository = new MemoryLessonRepository();

  const createLessonUsecase = new CreateLesson(lessonRepository, policiesService);
  const findLessonUsecase = new FindLesson(lessonRepository, policiesService);
  const findAllLessonUsecase = new FindAllLesson(lessonRepository, policiesService);
  const updateLessonUsecase = new UpdateLesson(lessonRepository, policiesService);
  const deleteLessonUsecase = new DeleteLesson(lessonRepository, policiesService);
  const addStudents = new AddStudents(lessonRepository, policiesService);
  const removeStudents = new RemoveStudents(lessonRepository, policiesService);
  const addDay = new AddDay(lessonRepository, policiesService);
  const removeDay = new RemoveDay(lessonRepository, policiesService);
  const addTime = new AddTime(lessonRepository, policiesService);
  const removeTime = new RemoveTime(lessonRepository, policiesService);

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

  const allowedRoles: RoleUsers[] = [
    RoleUsersEnum.MASTER,
    RoleUsersEnum.ADMINISTRATOR,
    RoleUsersEnum.TEACHER,
    RoleUsersEnum.STUDENT,
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const lessonRoute = new LessonRoute(lessonController, express, authUserMiddleware);
  lessonRoute.routes();
}
