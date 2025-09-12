import MasterFacade from '../facade/facade/master.facade';
import CreateUserMaster from '../usecases/master/createUserMaster.usecase';
import FindUserMaster from '../usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '../usecases/master/updateUserMaster.usecase';
import { EmailAuthValidator } from '../services/email-auth-validator.service';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { UserServiceInterface } from '../../domain/services/user.service';
import FindUserMasterByBaseUser from '../usecases/master/findUserMasterByBaseUser.usecase';
import UserMasterGateway from '../gateway/master.gateway';

export default class MasterFacadeFactory {
  static create(
    repository: UserMasterGateway,
    emailValidatorService: EmailAuthValidator,
    policiesService: PoliciesServiceInterface,
    userService: UserServiceInterface
  ): MasterFacade {
    const createUserMaster = new CreateUserMaster(
      repository,
      emailValidatorService,
      policiesService,
      userService
    );
    const findUserMaster = new FindUserMaster(repository, policiesService, userService);
    const updateUserMaster = new UpdateUserMaster(
      repository,
      policiesService,
      userService
    );
    const findUserMasterByBaseUser = new FindUserMasterByBaseUser(
      repository,
      userService
    );
    const facade = new MasterFacade({
      createUserMaster,
      findUserMaster,
      updateUserMaster,
      findUserMasterByBaseUser,
    });

    return facade;
  }
}
