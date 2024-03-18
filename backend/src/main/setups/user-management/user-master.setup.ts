import AuthUserMiddleware from '@/application/middleware/authUser.middleware';
import CreateUserMaster from '@/application/usecases/user-management/master/createUserMaster.usecase';
import FindUserMaster from '@/application/usecases/user-management/master/findUserMaster.usecase';
import UpdateUserMaster from '@/application/usecases/user-management/master/updateUserMaster.usecase';
import tokenInstance from '@/infraestructure/config/tokenService/token-service.instance';
import ExpressHttp from '@/infraestructure/http/express-http';
import MemoryUserMasterRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-master.repository';
import { UserMasterController } from '@/interface/controller/user-management/user-master.controller';
import { UserMasterRoute } from '@/interface/route/user-management/user-master.route';

export default function initializeUserMaster(express: ExpressHttp): void {
  const userMasterRepository = new MemoryUserMasterRepository();
  const createUserMasterUsecase = new CreateUserMaster(userMasterRepository);
  const findUserMasterUsecase = new FindUserMaster(userMasterRepository);
  const updateUserMasterUsecase = new UpdateUserMaster(userMasterRepository);
  const userMasterController = new UserMasterController(
    createUserMasterUsecase,
    findUserMasterUsecase,
    updateUserMasterUsecase
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = ['master'];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userMasterRoute = new UserMasterRoute(
    userMasterController,
    express,
    authUserMiddleware
  );
  userMasterRoute.routes();
}
