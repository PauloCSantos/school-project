import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserMaster from '@/modules/user-management/application/usecases/master/createUserMaster.usecase';
import FindUserMaster from '@/modules/user-management/application/usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '@/modules/user-management/application/usecases/master/updateUserMaster.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import ExpressHttp from '@/modules/@shared/infraestructure/http/express.adapter';
import MemoryUserMasterRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/master.repository';
import { UserMasterController } from '@/modules/user-management/interface/controller/master.controller';
import { UserMasterRoute } from '@/modules/user-management/interface/route/master.route';

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
