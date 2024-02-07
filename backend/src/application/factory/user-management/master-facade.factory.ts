import MasterFacade from '@/application/facade/user-management/facade/master.facade';
import CreateUserMaster from '@/application/usecases/user-management/master/createUserMaster.usecase';
import FindUserMaster from '@/application/usecases/user-management/master/findUserMaster.usecase';
import UpdateUserMaster from '@/application/usecases/user-management/master/updateUserMaster.usecase';
import MemoryUserMasterRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-master.repository';

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
