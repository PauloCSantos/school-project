import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';
import MemoryUserWorkerRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/worker.repository';

describe('MemoryUserWorkerRepository unit test', () => {
  let repository: MemoryUserWorkerRepository;

  const masterId = new Id().value;
  const address1 = new Address({
    street: 'Street A',
    city: 'City A',
    zip: '111111-111',
    number: 1,
    avenue: 'Avenue A',
    state: 'State A',
  });
  const address2 = new Address({
    street: 'Street B',
    city: 'City B',
    zip: '111111-222',
    number: 2,
    avenue: 'Avenue B',
    state: 'State B',
  });
  const address3 = new Address({
    street: 'Street C',
    city: 'City C',
    zip: '111111-333',
    number: 3,
    avenue: 'Avenue C',
    state: 'State C',
  });
  const name1 = new Name({
    firstName: 'John',
    middleName: 'David',
    lastName: 'Doe',
  });
  const name2 = new Name({
    firstName: 'Marie',
    lastName: 'Jane',
  });
  const name3 = new Name({
    firstName: 'Carlos',
    middleName: 'Mason',
    lastName: 'June',
  });

  const birthday1 = new Date('11-12-1995');
  const birthday2 = new Date('10-04-1995');
  const birthday3 = new Date('09-01-1995');
  const email1 = 'teste1@test.com';
  const email2 = 'teste2@test.com';
  const email3 = 'teste3@test.com';
  const salary1 = new Salary({ salary: 2500 });
  const salary2 = new Salary({ salary: 3000 });
  const salary3 = new Salary({ salary: 1500 });

  const userBase1 = new UserBase({
    name: name1,
    address: address1,
    birthday: birthday1,
    email: email1,
  });
  const userBase2 = new UserBase({
    name: name2,
    address: address2,
    birthday: birthday2,
    email: email2,
  });

  const userWorker1 = new UserWorker({
    userId: userBase1.id.value,
    salary: salary1,
  });
  const userWorker2 = new UserWorker({
    userId: userBase2.id.value,
    salary: salary2,
  });

  beforeEach(() => {
    repository = new MemoryUserWorkerRepository([
      { masterId, records: [userWorker1, userWorker2] },
    ]);
  });

  describe('On fail', () => {
    it('should received an null', async () => {
      const userId = new Id().value;
      const userWorkerFound = await repository.find(masterId, userId);

      expect(userWorkerFound).toBeNull();
    });
    it('should throw an error when the Id is wrong', async () => {
      const userWorker = new UserWorker({
        id: new Id().value,
        userId: new Id().value,
        salary: salary3,
      });

      await expect(repository.update(masterId, userWorker)).rejects.toThrow(
        'User not found'
      );
    });
    it('should generate an error when trying to remove the user with the wrong ID', async () => {
      await expect(repository.delete(masterId, new Id().value)).rejects.toThrow(
        'User not found'
      );
    });
  });
  describe('On success', () => {
    it('should find a user worker', async () => {
      const userId = userWorker1.id.value;
      const userWorkerFound = await repository.find(masterId, userId);

      expect(userWorkerFound).toBeDefined();
      expect(userWorkerFound!.id).toBeDefined();
      expect(userWorkerFound!.userId).toStrictEqual(userWorker1.userId);
      expect(userWorkerFound!.salary).toStrictEqual(userWorker1.salary);
    });
    it('should create a new user and return its id', async () => {
      const userBase = new UserBase({
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
      });
      const userWorker = new UserWorker({
        userId: userBase.id.value,
        salary: salary3,
      });
      const result = await repository.create(masterId, userWorker);

      expect(result).toBe(userWorker.id.value);
    });
    it('should update a user and return its new informations', async () => {
      const updateduserWorker: UserWorker = userWorker2;
      updateduserWorker.salary.increaseSalary(10);

      const result = await repository.update(masterId, updateduserWorker);

      expect(result).toEqual(updateduserWorker);
    });
    it('should find all the workers users', async () => {
      const allworkerUsers = await repository.findAll(masterId);

      expect(allworkerUsers.length).toBe(2);
      expect(allworkerUsers[0].userId).toStrictEqual(userWorker1.userId);
      expect(allworkerUsers[1].userId).toStrictEqual(userWorker2.userId);
      expect(allworkerUsers[0].salary).toStrictEqual(userWorker1.salary);
      expect(allworkerUsers[1].salary).toStrictEqual(userWorker2.salary);
    });
    it('should remove the user', async () => {
      const response = await repository.delete(masterId, userWorker1.id.value);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
