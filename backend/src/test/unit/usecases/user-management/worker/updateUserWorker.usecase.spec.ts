import UpdateUserWorker from '@/application/usecases/user-management/worker/updateUserWorker.usecase';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserWorker from '@/modules/user-management/worker/domain/entity/user-worker.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(userWorker => Promise.resolve(userWorker)),
    delete: jest.fn(),
  };
};

describe('updateUserWorker usecase unit test', () => {
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

  describe('On fail', () => {
    it('should throw an error if the user does not exist', async () => {
      const userWorkerRepository = MockRepository();
      userWorkerRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateUserWorker(userWorkerRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('User not found');
    });
  });
  describe('On success', () => {
    it('should update an user worker', async () => {
      const userWorkerRepository = MockRepository();
      userWorkerRepository.find.mockResolvedValue(userWorker1);
      const usecase = new UpdateUserWorker(userWorkerRepository);

      const result = await usecase.execute({
        id: userWorker1.id.id,
        address: {
          street: 'Street B',
          city: 'City B',
          zip: '111111-111',
          number: 1,
          avenue: 'Avenue B',
          state: 'State B',
        },
      });

      expect(userWorkerRepository.update).toHaveBeenCalled();
      expect(userWorkerRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        name: {
          fullName: userWorker1.name.fullName(),
          shortName: userWorker1.name.shortName(),
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
