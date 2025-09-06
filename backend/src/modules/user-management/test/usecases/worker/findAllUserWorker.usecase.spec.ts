import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindAllUserWorker from '@/modules/user-management/application/usecases/worker/findAllUserWorker.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

describe('findAllUserWorker usecase unit test', () => {
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
      findBaseUserByEmail: jest.fn(),
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
  const userWorker1 = new UserWorker({
    userId: userBase1.id.value,
    salary: new Salary({ salary: 2500 }),
  });

  const userBase2 = new UserBase({
    name: new Name({
      firstName: 'Marie',
      lastName: 'Mason',
    }),
    address: new Address({
      street: 'Street B',
      city: 'City B',
      zip: '111111-222',
      number: 2,
      avenue: 'Avenue B',
      state: 'State B',
    }),
    birthday: new Date('05-24-1995'),
    email: 'teste2@test.com',
  });
  const userWorker2 = new UserWorker({
    userId: userBase2.id.value,
    salary: new Salary({ salary: 8500 }),
  });

  describe('On success', () => {
    it('should find all users administrator', async () => {
      const userWorkerRepository = MockRepository();
      const userService = MockUserService();

      userWorkerRepository.findAll.mockResolvedValue([userWorker1, userWorker2]);
      userService.findBaseUsers.mockResolvedValue([
        { entity: userWorker1, user: userBase1 },
        { entity: userWorker2, user: userBase2 },
      ]);

      const usecase = new FindAllUserWorker(
        userWorkerRepository,
        policieService,
        userService
      );

      const result = await usecase.execute({}, token);

      expect(userWorkerRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const userWorkerRepository = MockRepository();
      const userService = MockUserService();

      userWorkerRepository.findAll.mockResolvedValue([]);
      userService.findBaseUsers.mockResolvedValue([]);

      const usecase = new FindAllUserWorker(
        userWorkerRepository,
        policieService,
        userService
      );

      const result = await usecase.execute({}, token);

      expect(userWorkerRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
