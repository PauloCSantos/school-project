import FindAllUserWorker from '@/application/usecases/user-management/worker/findAllUserWorker.usecase';
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
    delete: jest.fn(),
  };
};

describe('findAllUserWorker usecase unit test', () => {
  const userWorker1 = new UserWorker({
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
    salary: new Salary({ salary: 2500 }),
  });
  const userWorker2 = new UserWorker({
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
    salary: new Salary({ salary: 8500 }),
  });

  describe('On success', () => {
    it('should find all users administrator', async () => {
      const userWorkerRepository = MockRepository();
      userWorkerRepository.findAll.mockResolvedValue([
        userWorker1,
        userWorker2,
      ]);
      const usecase = new FindAllUserWorker(userWorkerRepository);

      const result = await usecase.execute({});

      expect(userWorkerRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const userWorkerRepository = MockRepository();
      userWorkerRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllUserWorker(userWorkerRepository);

      const result = await usecase.execute({});

      expect(userWorkerRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
