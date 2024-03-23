import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import CreateUserStudent from '@/application/usecases/user-management/student/createUserStudent.usecase';
import DeleteUserStudent from '@/application/usecases/user-management/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/application/usecases/user-management/student/findAllUserStudent.usecase';
import FindUserStudent from '@/application/usecases/user-management/student/findUserStudent.usecase';
import UpdateUserStudent from '@/application/usecases/user-management/student/updateUserStudent.usecase';
import tokenInstance from '@/infraestructure/config/tokenService/token-service.instance';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryUserStudentRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-student.repository';
import { UserStudentController } from '@/interface/controller/user-management/user-student.controller';
import { UserStudentRoute } from '@/interface/route/user-management/user-student.route';

export default function initializeUserStudent(express: ExpressHttp): void {
  const userStudentRepository = new MemoryUserStudentRepository();
  const createUserStudentUsecase = new CreateUserStudent(userStudentRepository);
  const findUserStudentUsecase = new FindUserStudent(userStudentRepository);
  const findAllUserStudentUsecase = new FindAllUserStudent(
    userStudentRepository
  );
  const deleteUserStudentUsecase = new DeleteUserStudent(userStudentRepository);
  const updateUserStudentUsecase = new UpdateUserStudent(userStudentRepository);
  const userStudentController = new UserStudentController(
    createUserStudentUsecase,
    findUserStudentUsecase,
    findAllUserStudentUsecase,
    updateUserStudentUsecase,
    deleteUserStudentUsecase
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = [
    'master',
    'administrator',
    'student',
    'teacher',
  ];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userStudentRoute = new UserStudentRoute(
    userStudentController,
    express,
    authUserMiddleware
  );
  userStudentRoute.routes();
}
