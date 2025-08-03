import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateUserWorker from '@/modules/user-management/application/usecases/worker/createUserWorker.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

describe('createUserWorker usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => ({
    find: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(userWorker => Promise.resolve(userWorker.id.value)),
    update: jest.fn(),
    delete: jest.fn(),
  });

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

  const userWorker = new UserWorker({
    name: new Name(input.name),
    address: new Address(input.address),
    salary: new Salary(input.salary),
    birthday: input.birthday,
    email: input.email,
  });

  describe('On fail', () => {
    it('should throw an error if the user already exists', async () => {
      const userWorkerRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userWorkerRepository.findByEmail.mockResolvedValue(userWorker);

      const usecase = new CreateUserWorker(
        userWorkerRepository,
        emailAuthValidatorService,
        policieService
      );

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'User already exists'
      );
      expect(userWorkerRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userWorkerRepository.create).not.toHaveBeenCalled();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });

  describe('On success', () => {
    it('should create a user worker', async () => {
      const userWorkerRepository = MockRepository();
      const emailAuthValidatorService = MockEmailAuthValidatorService();

      userWorkerRepository.findByEmail.mockResolvedValue(null);

      const usecase = new CreateUserWorker(
        userWorkerRepository,
        emailAuthValidatorService,
        policieService
      );
      const result = await usecase.execute(input, token);

      expect(userWorkerRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userWorkerRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(emailAuthValidatorService.validate).toHaveBeenCalledWith(
        input.email
      );
    });
  });
});
