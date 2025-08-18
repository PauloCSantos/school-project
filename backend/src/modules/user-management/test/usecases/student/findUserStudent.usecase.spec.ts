import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindUserStudent from '@/modules/user-management/application/usecases/student/findUserStudent.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';

describe('findUserStudent usecase unit test', () => {
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
    paymentYear: 28000,
  });
  describe('On success', () => {
    it('should find an user student', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.find.mockResolvedValue(userStudent1);
      const usecase = new FindUserStudent(
        userStudentRepository,
        policieService
      );

      const result = await usecase.execute(
        { id: userStudent1.id.value },
        token
      );

      expect(userStudentRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return null when id is not found', async () => {
      const userStudentRepository = MockRepository();
      userStudentRepository.find.mockResolvedValue(null);

      const usecase = new FindUserStudent(
        userStudentRepository,
        policieService
      );
      const result = await usecase.execute(
        {
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        },
        token
      );

      expect(result).toBeNull();
    });
  });
});
