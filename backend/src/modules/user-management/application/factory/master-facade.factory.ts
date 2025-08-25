import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryUserMasterRepository from '../../infrastructure/repositories/memory-repository/master.repository';
import MasterFacade from '../facade/facade/master.facade';
import CreateUserMaster from '../usecases/master/createUserMaster.usecase';
import FindUserMaster from '../usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '../usecases/master/updateUserMaster.usecase';
import { EmailAuthValidatorService } from '../services/email-auth-validator.service';
import { PoliciesService } from '@/modules/@shared/application/services/policies.service';
import { UserService } from '../../domain/services/user.service';
import MemoryUserRepository from '../../infrastructure/repositories/memory-repository/user.repository';

export default class MasterFacadeFactory {
  static create(): MasterFacade {
    const repository = new MemoryUserMasterRepository();
    const authUserRepository = new MemoryAuthUserRepository();
    const userRepository = new MemoryUserRepository();
    const emailValidatorService = new EmailAuthValidatorService(authUserRepository);
    const policiesService = new PoliciesService();
    const userService = new UserService(userRepository);
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
    const facade = new MasterFacade({
      createUserMaster,
      findUserMaster,
      updateUserMaster,
    });

    return facade;
  }
}
