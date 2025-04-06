import MasterFacade from '../facade/facade/master.facade';
import CreateUserMaster from '../usecases/master/createUserMaster.usecase';
import FindUserMaster from '../usecases/master/findUserMaster.usecase';
import UpdateUserMaster from '../usecases/master/updateUserMaster.usecase';
import MemoryUserMasterRepository from '../../infrastructure/repositories/memory-repository/user-master.repository';

export default class MasterFacadeFactory {
  static create(): MasterFacade {
    const repository = new MemoryUserMasterRepository();
    const createUserMaster = new CreateUserMaster(repository);
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
