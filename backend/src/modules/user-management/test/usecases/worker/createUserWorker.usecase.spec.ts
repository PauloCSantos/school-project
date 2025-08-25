import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateUserWorker from '@/modules/user-management/application/usecases/worker/createUserWorker.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

describe('createUserWorker usecase unit test', () => {
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
  };

  const userBase = new UserBase({
    name: new Name(input.name),
    address: new Address(input.address),
    birthday: input.birthday,
    email: input.email,
  });

  const userWorker = new UserWorker({
    userId: userBase.id.value,
    salary: new Salary(input.salary),
  });

  describe('On fail', () => {
    it('should throw an error if the user already exists', async () => {
      const userWorkerRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();
      const userService = MockUserService();

      userService.getOrCreateUser.mockResolvedValue(userBase);
      userWorkerRepository.findByBaseUserId.mockResolvedValue(userWorker);

      const usecase = new CreateUserWorker(
        userWorkerRepository,
        emailAuthValidatorService,
        policieService,
        userService
      );

      await expect(usecase.execute(input, token)).rejects.toThrow('User already exists');
      expect(userWorkerRepository.findByBaseUserId).toHaveBeenCalledWith(
        token.masterId,
        expect.any(String)
      );
      expect(userWorkerRepository.create).not.toHaveBeenCalled();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(input.email);
    });
  });

  describe('On success', () => {
    it('should create a user worker', async () => {
      const userWorkerRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();
      const userService = MockUserService();

      userService.getOrCreateUser.mockResolvedValue(userBase);
      userWorkerRepository.findByBaseUserId.mockResolvedValue(null);
      userWorkerRepository.create.mockResolvedValue({
        id: userWorker.id.value,
      });

      const usecase = new CreateUserWorker(
        userWorkerRepository,
        emailAuthValidatorService,
        policieService,
        userService
      );
      const result = await usecase.execute(input, token);

      expect(userWorkerRepository.findByBaseUserId).toHaveBeenCalledWith(
        token.masterId,
        expect.any(String)
      );
      expect(userWorkerRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(input.email);
    });
  });
});
