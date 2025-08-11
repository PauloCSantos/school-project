import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import DeleteUserWorker from '@/modules/user-management/application/usecases/worker/deleteUserWorker.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

describe('deleteUserWorker usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
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
  };

  const userWorker = new UserWorker({
    name: new Name(input.name),
    address: new Address(input.address),
    salary: new Salary(input.salary),
    birthday: input.birthday,
    email: input.email,
  });

  describe('On fail', () => {
    it('should return an error if the user does not exist', async () => {
      const userWorkerRepository = MockRepository();
      userWorkerRepository.find.mockResolvedValue(null);

      const usecase = new DeleteUserWorker(
        userWorkerRepository,
        policieService
      );

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' }, token)
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should delete a user worker', async () => {
      const userWorkerRepository = MockRepository();
      userWorkerRepository.find.mockResolvedValue(userWorker);
      const usecase = new DeleteUserWorker(
        userWorkerRepository,
        policieService
      );
      const result = await usecase.execute(
        {
          id: userWorker.id.value,
        },
        token
      );

      expect(userWorkerRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
