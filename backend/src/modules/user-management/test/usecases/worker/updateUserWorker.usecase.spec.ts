import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import UpdateUserWorker from '@/modules/user-management/application/usecases/worker/updateUserWorker.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

describe('updateUserWorker usecase unit test', () => {
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
  const userWorker1 = new UserWorker({
    userId: userBase.id.value,
    salary: new Salary({ salary: 2500 }),
  });

  describe('On fail', () => {
    it('should throw an error if the user does not exist', async () => {
      const userWorkerRepository = MockRepository();
      const userService = MockUserService();

      userWorkerRepository.find.mockResolvedValue(null);

      const usecase = new UpdateUserWorker(
        userWorkerRepository,
        policieService,
        userService
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
    it('should update an user worker', async () => {
      const userWorkerRepository = MockRepository();
      const userService = MockUserService();

      userWorkerRepository.find.mockResolvedValue(userWorker1);
      userWorkerRepository.update.mockResolvedValue(userWorker1);
      userService.findBaseUser.mockResolvedValue(userBase);
      userService.update.mockResolvedValue(userBase);

      const usecase = new UpdateUserWorker(
        userWorkerRepository,
        policieService,
        userService
      );

      const result = await usecase.execute(
        {
          id: userWorker1.id.value,
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

      expect(userWorkerRepository.update).toHaveBeenCalled();
      expect(userWorkerRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: userWorker1.id.value,
        name: {
          fullName: userBase.name.fullName(),
          shortName: userBase.name.shortName(),
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
        salary: userWorker1.salary.calculateTotalIncome(),
      });
    });
  });
});
