import FindUserStudentByBaseUser from '@/modules/user-management/application/usecases/student/findUserStudentByBaseUser.usecase';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';

describe('findUserStudentByBaseUser usecase unit test', () => {
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
  const userStudent1 = new UserStudent({
    userId: userBase.id.value,
    paymentYear: 28000,
  });

  describe('On success', () => {
    it('should find an user student', async () => {
      token = {
        email: 'teste1@test.com',
        role: RoleUsersEnum.STUDENT,
        masterId: 'valid id',
      };
      const userStudentRepository = MockRepository();

      userStudentRepository.findByBaseUserId.mockResolvedValue(userStudent1);

      const usecase = new FindUserStudentByBaseUser(userStudentRepository);
      const result = await usecase.execute(token);

      expect(userStudentRepository.findByBaseUserId).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return null when id is not found', async () => {
      token = {
        email: 'newUser@test.com',
        role: RoleUsersEnum.STUDENT,
        masterId: 'valid id',
      };
      const userStudentRepository = MockRepository();

      userStudentRepository.findByBaseUserId.mockResolvedValue(null);

      const usecase = new FindUserStudentByBaseUser(userStudentRepository);
      const result = await usecase.execute(token);

      expect(result).toBeNull();
    });
  });
});
