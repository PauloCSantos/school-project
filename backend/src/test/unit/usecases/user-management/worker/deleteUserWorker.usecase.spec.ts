import DeleteUserWorker from '@/application/usecases/user-management/worker/deleteUserWorker.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserWorker from '@/modules/user-management/worker/domain/entity/user-worker.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
  };
};

describe('deleteUserWorker usecase unit test', () => {
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
      userWorkerRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteUserWorker(userWorkerRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should delete a user worker', async () => {
      const userWorkerRepository = MockRepository();
      userWorkerRepository.find.mockResolvedValue(userWorker);
      const usecase = new DeleteUserWorker(userWorkerRepository);
      const result = await usecase.execute({
        id: userWorker.id.id,
      });

      expect(userWorkerRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
