import AuthUserMiddleware from '@/modules/@shared/application/middleware/authUser.middleware';
import CreateUserMaster from '@/modules/user-management/application/usecases/master/createUserMaster.usecase';
import FindUserMaster from '@/modules/user-management/application/usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '@/modules/user-management/application/usecases/master/updateUserMaster.usecase';
import tokenInstance from '@/main/config/tokenService/token-service.instance';
import MemoryUserMasterRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/master.repository';
import { UserMasterController } from '@/modules/user-management/interface/controller/master.controller';
import { UserMasterRoute } from '@/modules/user-management/interface/route/master.route';
import { HttpServer } from '@/modules/@shared/infraestructure/http/http.interface';
import { RoleUsers, RoleUsersEnum } from '@/modules/@shared/type/enum';
import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import { EmailAuthValidatorService } from '@/modules/user-management/application/services/email-auth-validator.service';

export default function initializeUserMaster(express: HttpServer): void {
  const userMasterRepository = new MemoryUserMasterRepository();
  const authUserRepository = new MemoryAuthUserRepository();
  const emailValidatorService = new EmailAuthValidatorService(
    authUserRepository
  );
  const createUserMasterUsecase = new CreateUserMaster(
    userMasterRepository,
    emailValidatorService
  );
  const findUserMasterUsecase = new FindUserMaster(userMasterRepository);
  const updateUserMasterUsecase = new UpdateUserMaster(userMasterRepository);
  const userMasterController = new UserMasterController(
    createUserMasterUsecase,
    findUserMasterUsecase,
    updateUserMasterUsecase
  );
  const tokenService = tokenInstance();
  const allowedRoles: RoleUsers[] = [RoleUsersEnum.MASTER];
  const authUserMiddleware = new AuthUserMiddleware(tokenService, allowedRoles);
  const userMasterRoute = new UserMasterRoute(
    userMasterController,
    express,
    authUserMiddleware
  );
  userMasterRoute.routes();
}
