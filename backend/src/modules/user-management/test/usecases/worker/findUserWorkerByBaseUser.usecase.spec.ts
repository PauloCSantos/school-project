import FindUserWorkerByBaseUser from '@/modules/user-management/application/usecases/worker/findUserTeacherByBaseUser.usecase';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

describe('findUserWorkerByBaseUser usecase unit test', () => {
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findByBaseUserId: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  };

  const userBase = new UserBase({
    name: new Name({
      firstName: 'John',
      middleName: 'David',
      lastName: 'Doe',
    }),
    address: new Address({
      street: 'Street A',
      city: 'City A',
      zip: '111111-111',
      number: 1,
      avenue: 'Avenue A',
      state: 'State A',
    }),
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
  });
  const userWorker1 = new UserWorker({
    userId: userBase.id.value,
    salary: new Salary({ salary: 2500 }),
  });

  describe('On success', () => {
    it('should find an user worker', async () => {
      token = {
        email: 'teste1@test.com',
        role: RoleUsersEnum.WORKER,
        masterId: 'valid id',
      };
      const userWorkerRepository = MockRepository();

      userWorkerRepository.findByBaseUserId.mockResolvedValue(userWorker1);

      const usecase = new FindUserWorkerByBaseUser(userWorkerRepository);
      const result = await usecase.execute(token);

      expect(userWorkerRepository.findByBaseUserId).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return null when id is not found', async () => {
      token = {
        email: 'newUser@test.com',
        role: RoleUsersEnum.WORKER,
        masterId: 'valid id',
      };
      const userWorkerRepository = MockRepository();

      userWorkerRepository.findByBaseUserId.mockResolvedValue(null);

      const usecase = new FindUserWorkerByBaseUser(userWorkerRepository);
      const result = await usecase.execute(token);

      expect(result).toBeNull();
    });
  });
});
