import MemoryAuthUserRepository from '@/modules/authentication-authorization-management/infrastructure/repositories/memory-repository/user.repository';
import MemoryUserMasterRepository from '../../infrastructure/repositories/memory-repository/master.repository';
import MasterFacade from '../facade/facade/master.facade';
import CreateUserMaster from '../usecases/master/createUserMaster.usecase';
import FindUserMaster from '../usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '../usecases/master/updateUserMaster.usecase';
import { EmailAuthValidatorService } from '../services/email-auth-validator.service';

export default class MasterFacadeFactory {
  static create(): MasterFacade {
    const repository = new MemoryUserMasterRepository();
    const authUserRepository = new MemoryAuthUserRepository();
    const emailValidatorService = new EmailAuthValidatorService(
      authUserRepository
    );
    const createUserMaster = new CreateUserMaster(
      repository,
      emailValidatorService
    );
    const findUserMaster = new FindUserMaster(repository);
    const updateUserMaster = new UpdateUserMaster(repository);
    const facade = new MasterFacade({
      createUserMaster,
      findUserMaster,
      updateUserMaster,
    });

    return facade;
  }
}
