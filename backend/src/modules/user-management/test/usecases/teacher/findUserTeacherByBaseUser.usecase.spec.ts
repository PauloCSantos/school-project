import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindUserTeacherByBaseUser from '@/modules/user-management/application/usecases/teacher/findUserTeacherByBaseUser.usecase';

import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';

describe('findUserTeacherByBaseUser usecase unit test', () => {
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

  const MockUserService = () => {
    return {
      getOrCreateUser: jest.fn(),
      findBaseUsers: jest.fn(),
      findBaseUser: jest.fn(),
      update: jest.fn(),
      findBaseUserByEmail: jest.fn(),
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
  const userTeacher1 = new UserTeacher({
    userId: userBase.id.value,
    salary: new Salary({ salary: 2500 }),
    graduation: 'Math',
    academicDegrees: 'Msc',
  });

  describe('On success', () => {
    it('should find an user teacher', async () => {
      token = {
        email: 'teste1@test.com',
        role: RoleUsersEnum.TEACHER,
        masterId: 'valid id',
      };
      const userTeacherRepository = MockRepository();
      const userService = MockUserService();

      userTeacherRepository.findByBaseUserId.mockResolvedValue(userTeacher1);
      userService.findBaseUserByEmail.mockResolvedValue(userBase);

      const usecase = new FindUserTeacherByBaseUser(userTeacherRepository, userService);
      const result = await usecase.execute(token);

      expect(userTeacherRepository.findByBaseUserId).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return null when id is not found', async () => {
      token = {
        email: 'newUser@test.com',
        role: RoleUsersEnum.TEACHER,
        masterId: 'valid id',
      };
      const userTeacherRepository = MockRepository();
      const userService = MockUserService();

      userTeacherRepository.findByBaseUserId.mockResolvedValue(null);
      userService.findBaseUserByEmail.mockResolvedValue(userBase);

      const usecase = new FindUserTeacherByBaseUser(userTeacherRepository, userService);
      const result = await usecase.execute(token);

      expect(result).toBeNull();
    });
  });
});
