import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import UpdateUserTeacher from '@/modules/user-management/application/usecases/teacher/updateUserTeacher.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';

describe('updateUserTeacher usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  };

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  policieService = MockPolicyService();
  token = {
    email: 'caller@domain.com',
    role: RoleUsersEnum.MASTER,
    masterId: new Id().value,
  };

  const input = {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: {
      street: 'Street A',
      city: 'City A',
      zip: '111111-111',
      number: 1,
      avenue: 'Avenue A',
      state: 'State A',
    },
    salary: {
      salary: 5000,
    },
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    graduation: 'Math',
    academicDegrees: 'Msc',
  };

  const userTeacher1 = new UserTeacher({
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
    salary: new Salary({ salary: 2500 }),
    graduation: 'Math',
    academicDegrees: 'Msc',
  });

  describe('On fail', () => {
    it('should throw an error if the user does not exist', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.find.mockResolvedValue(null);
      const usecase = new UpdateUserTeacher(
        userTeacherRepository,
        policieService
      );

      await expect(
        usecase.execute(
          {
            ...input,
            id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
          },
          token
        )
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should update an user teacher', async () => {
      const userTeacherRepository = MockRepository();
      userTeacherRepository.find.mockResolvedValue(userTeacher1);
      userTeacherRepository.update.mockResolvedValue(userTeacher1);
      const usecase = new UpdateUserTeacher(
        userTeacherRepository,
        policieService
      );

      const result = await usecase.execute(
        {
          id: userTeacher1.id.value,
          address: {
            street: 'Street B',
            city: 'City B',
            zip: '111111-111',
            number: 1,
            avenue: 'Avenue B',
            state: 'State B',
          },
        },
        token
      );

      expect(userTeacherRepository.update).toHaveBeenCalled();
      expect(userTeacherRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: userTeacher1.id.value,
        name: {
          fullName: userTeacher1.name.fullName(),
          shortName: userTeacher1.name.shortName(),
        },
        address: {
          street: 'Street B',
          city: 'City B',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
        birthday: new Date('11-12-1995'),
        email: 'teste1@test.com',
        salary: userTeacher1.salary.calculateTotalIncome(),
        graduation: 'Math',
        academicDegrees: 'Msc',
      });
    });
  });
});
