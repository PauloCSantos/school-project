import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindUserAdministrator from '@/modules/user-management/application/usecases/administrator/findUserAdministrator.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';

describe('findUserAdministrator usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
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
      const userAdministratorRepository = MockRepository();
      const userService = MockUserService();

      userAdministratorRepository.find.mockResolvedValue(userAdministrator1);
      userService.findBaseUser.mockResolvedValue(userBase1);

      const usecase = new FindUserAdministrator(
        userAdministratorRepository,
        policieService,
        userService
      );

      const result = await usecase.execute({ id: userAdministrator1.id.value }, token);

      expect(userAdministratorRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return null when id is not found', async () => {
      const userAdministratorRepository = MockRepository();
      const userService = MockUserService();

      userAdministratorRepository.find.mockResolvedValue(null);

      const usecase = new FindUserAdministrator(
        userAdministratorRepository,
        policieService,
        userService
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
