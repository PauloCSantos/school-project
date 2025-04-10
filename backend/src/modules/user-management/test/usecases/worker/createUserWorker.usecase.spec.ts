import CreateUserWorker from '@/modules/user-management/application/usecases/worker/createUserWorker.usecase';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(userWorker => Promise.resolve(userWorker.id.value)),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createUserWorker usecase unit test', () => {
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
      userWorkerRepository.find.mockResolvedValue(userWorker);

      const usecase = new CreateUserWorker(userWorkerRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'User already exists'
      );
      expect(userWorkerRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userWorkerRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a user administrator', async () => {
      const userWorkerRepository = MockRepository();
      userWorkerRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateUserWorker(userWorkerRepository);
      const result = await usecase.execute(input);

      expect(userWorkerRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(userWorkerRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
