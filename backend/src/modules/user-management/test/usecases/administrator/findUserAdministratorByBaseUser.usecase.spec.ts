import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindUserAdministratorByBaseUser from '@/modules/user-management/application/usecases/administrator/findUserAdministratorByBaseUser.usecase';

import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';

describe('findUserAdministratorByBaseUser usecase unit test', () => {
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

  const userBase1 = new UserBase({
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
  const userAdministrator1 = new UserAdministrator({
    userId: userBase1.id.value,
    salary: new Salary({ salary: 2500 }),
    graduation: 'Math',
  });

  describe('On success', () => {
    it('should find an user administrator', async () => {
      token = {
        email: 'teste1@test.com',
        role: RoleUsersEnum.ADMINISTRATOR,
        masterId: 'valid id',
      };
      const userAdministratorRepository = MockRepository();

      userAdministratorRepository.findByBaseUserId.mockResolvedValue(userAdministrator1);

      const usecase = new FindUserAdministratorByBaseUser(userAdministratorRepository);
      const result = await usecase.execute(token);

      expect(userAdministratorRepository.findByBaseUserId).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return null when id is not found', async () => {
      token = {
        email: 'newUser@test.com',
        role: RoleUsersEnum.ADMINISTRATOR,
        masterId: 'valid id',
      };
      const userAdministratorRepository = MockRepository();

      userAdministratorRepository.find.mockResolvedValue(null);

      const usecase = new FindUserAdministratorByBaseUser(userAdministratorRepository);
      const result = await usecase.execute(token);

      expect(result).toBeNull();
    });
  });
});
