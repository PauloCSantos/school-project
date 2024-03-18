import CreateUserTeacher from '@/application/usecases/user-management/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '@/application/usecases/user-management/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '@/application/usecases/user-management/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '@/application/usecases/user-management/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '@/application/usecases/user-management/teacher/updateUserTeacher.usecase';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryUserTeacherRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-teacher.repository';
import { UserTeacherController } from '@/interface/controller/user-management/user-teacher.controller';
import { UserTeacherRoute } from '@/interface/route/user-management/user-teacher.route';

export default function initializeUserTeacher(express: ExpressHttp): void {
  const userTeacherRepository = new MemoryUserTeacherRepository();
  const createUserTeacherUsecase = new CreateUserTeacher(userTeacherRepository);
  const findUserTeacherUsecase = new FindUserTeacher(userTeacherRepository);
  const findAllUserTeacherUsecase = new FindAllUserTeacher(
    userTeacherRepository
  );
  const deleteUserTeacherUsecase = new DeleteUserTeacher(userTeacherRepository);
  const updateUserTeacherUsecase = new UpdateUserTeacher(userTeacherRepository);
  const userTeacherController = new UserTeacherController(
    createUserTeacherUsecase,
    findUserTeacherUsecase,
    findAllUserTeacherUsecase,
    updateUserTeacherUsecase,
    deleteUserTeacherUsecase
  );
  const userTeacherRoute = new UserTeacherRoute(userTeacherController, express);
  userTeacherRoute.routes();
}
