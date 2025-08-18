import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateUserAdministrator from '@/modules/user-management/application/usecases/administrator/createUserAdministrator.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';

describe('createUserAdministrator usecase unit test', () => {
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

  const MockEmailAuthValidatorService = () => ({
    validate: jest.fn().mockResolvedValue(true),
  });

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
  };

  const userAdministrator = new UserAdministrator({
    name: new Name(input.name),
    address: new Address(input.address),
    salary: new Salary(input.salary),
    birthday: input.birthday,
    email: input.email,
    graduation: input.graduation,
  });

  describe('On fail', () => {
    it('should throw an error if the user already exists', async () => {
      const userAdministratorRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userAdministratorRepository.findByEmail.mockResolvedValue(
        userAdministrator
      );

      const usecase = new CreateUserAdministrator(
        userAdministratorRepository,
        emailAuthValidatorService,
        policieService
      );

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'User already exists'
      );
      expect(userAdministratorRepository.findByEmail).toHaveBeenCalledWith(
        token.masterId,
        expect.any(String)
      );
      expect(userAdministratorRepository.create).not.toHaveBeenCalled();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });

  describe('On success', () => {
    it('should create a user administrator', async () => {
      const userAdministratorRepository = MockRepository();
      userAdministratorRepository.create.mockResolvedValue(userAdministrator);
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userAdministratorRepository.findByEmail.mockResolvedValue(null);

      const usecase = new CreateUserAdministrator(
        userAdministratorRepository,
        emailAuthValidatorService,
        policieService
      );
      const result = await usecase.execute(input, token);

      expect(userAdministratorRepository.findByEmail).toHaveBeenCalledWith(
        token.masterId,
        expect.any(String)
      );
      expect(userAdministratorRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });
});
