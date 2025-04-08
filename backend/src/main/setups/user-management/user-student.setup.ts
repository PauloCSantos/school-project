import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserStudent from '@/modules/user-management/application/usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '@/modules/user-management/application/usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/modules/user-management/application/usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '@/modules/user-management/application/usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '@/modules/user-management/application/usecases/student/updateUserStudent.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import MemoryUserStudentRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/student.repository';
import { UserStudentController } from '@/modules/user-management/interface/controller/student.controller';
import { UserStudentRoute } from '@/modules/user-management/interface/route/student.route';

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
