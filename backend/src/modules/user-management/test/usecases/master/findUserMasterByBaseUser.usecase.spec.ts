import FindUserMasterByBaseUser from '@/modules/user-management/application/usecases/master/findUserMasterByBaseUser.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';

describe('findUserMasterByBaseUser usecase unit test', () => {
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findByBaseUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
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
  const userMaster1 = new UserMaster({
    userId: userBase.id.value,
    cnpj: '35.741.901/0001-58',
  });

  describe('On success', () => {
    it('should find an user master', async () => {
      token = {
        email: 'teste1@test.com',
        role: RoleUsersEnum.MASTER,
        masterId: 'valid id',
      };
      const userMasterRepository = MockRepository();

      userMasterRepository.findByBaseUserId.mockResolvedValue(userMaster1);

      const usecase = new FindUserMasterByBaseUser(userMasterRepository);

      const result = await usecase.execute(token);

      expect(userMasterRepository.findByBaseUserId).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return null when id is not found', async () => {
      token = {
        email: 'newUser@test.com',
        role: RoleUsersEnum.MASTER,
        masterId: 'valid id',
      };
      const userMasterRepository = MockRepository();

      userMasterRepository.findByBaseUserId.mockResolvedValue(null);

      const usecase = new FindUserMasterByBaseUser(userMasterRepository);
      const result = await usecase.execute(token);

      expect(result).toBeNull();
    });
  });
});
