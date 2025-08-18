import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import UpdateUserStudent from '@/modules/user-management/application/usecases/student/updateUserStudent.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';

describe('updateUserStudent usecase unit test', () => {
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
    birthday: new Date('11-12-1995'),
    email: 'teste1@test.com',
    paymentYear: 25000,
  };

  const userStudent1 = new UserStudent({
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
    paymentYear: 20000,
  });

  describe('On fail', () => {
    it('should throw an error if the user does not exist', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.find.mockResolvedValue(null);
      const usecase = new UpdateUserStudent(
        userStudentRepository,
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
    it('should update an user student', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.find.mockResolvedValue(userStudent1);
      userStudentRepository.update.mockResolvedValue(userStudent1);
      const usecase = new UpdateUserStudent(
        userStudentRepository,
        policieService
      );

      const result = await usecase.execute(
        {
          id: userStudent1.id.value,
          address: {
            street: 'Street B',
            city: 'City B',
            zip: '111111-111',
            number: 1,
            avenue: 'Avenue B',
            state: 'State B',
          },
          paymentYear: input.paymentYear,
        },
        token
      );

      expect(userStudentRepository.update).toHaveBeenCalled();
      expect(userStudentRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: userStudent1.id.value,
        name: {
          fullName: userStudent1.name.fullName(),
          shortName: userStudent1.name.shortName(),
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
        paymentYear: 25000,
      });
    });
  });
});
