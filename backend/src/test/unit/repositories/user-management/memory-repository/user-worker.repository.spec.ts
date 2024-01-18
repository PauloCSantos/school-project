import MemoryUserWorkerRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-worker.repository';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserWorker from '@/modules/user-management/worker/domain/entity/user-worker.entity';

describe('MemoryUserWorkerRepository unit test', () => {
  let repository: MemoryUserWorkerRepository;

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

  const userWorker1 = new UserWorker({
    name: name1,
    address: address1,
    birthday: birthday1,
    email: email1,
    salary: salary1,
  });
  const userWorker2 = new UserWorker({
    name: name2,
    address: address2,
    birthday: birthday2,
    email: email2,
    salary: salary2,
  });

  beforeEach(() => {
    repository = new MemoryUserWorkerRepository([userWorker1, userWorker2]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const userId = new Id().id;
      const userWorkerFound = await repository.find(userId);

      expect(userWorkerFound).toBeUndefined;
    });
    it('should throw an error when the Id is wrong', async () => {
      const userWorker = new UserWorker({
        id: new Id(),
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
        salary: salary3,
      });

      await expect(repository.update(userWorker)).rejects.toThrow(
        'User not found'
      );
    });
    it('should generate an error when trying to remove the user with the wrong ID', async () => {
      await expect(repository.delete(new Id().id)).rejects.toThrow(
        'User not found'
      );
    });
  });
  describe('On success', () => {
    it('should find a user worker', async () => {
      const userId = userWorker1.id.id;
      const userWorkerFound = await repository.find(userId);

      expect(userWorkerFound).toBeDefined;
      //@ts-expect-error
      expect(userWorkerFound.id).toBeUndefined;
      expect(userWorkerFound!.name).toBe(userWorker1.name);
      expect(userWorkerFound!.address).toBe(userWorker1.address);
      expect(userWorkerFound!.email).toBe(userWorker1.email);
      expect(userWorkerFound!.birthday).toBe(userWorker1.birthday);
      expect(userWorkerFound!.salary).toBe(userWorker1.salary);
    });
    it('should create a new user and return its id', async () => {
      const userWorker = new UserWorker({
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
        salary: salary3,
      });
      const result = await repository.create(userWorker);

      expect(result).toBe(userWorker.id.id);
    });
    it('should update a user and return its new informations', async () => {
      const updateduserWorker: UserWorker = userWorker2;
      updateduserWorker.name.firstName = 'Jane';
      updateduserWorker.name.middleName = 'Monza';
      updateduserWorker.name.lastName = 'Gueda';
      updateduserWorker.address.city = address3.city;
      updateduserWorker.address.avenue = address3.avenue;
      updateduserWorker.address.number = address3.number;
      updateduserWorker.address.state = address3.state;
      updateduserWorker.address.zip = address3.zip;
      updateduserWorker.address.street = address3.street;

      const result = await repository.update(updateduserWorker);

      expect(result).toEqual(updateduserWorker);
    });
    it('should find all the workers users', async () => {
      const allworkerUsers = await repository.findAll();

      expect(allworkerUsers.length).toBe(2);
      expect(allworkerUsers[0].name).toBe(userWorker1.name);
      expect(allworkerUsers[1].name).toBe(userWorker2.name);
      expect(allworkerUsers[0].email).toBe(userWorker1.email);
      expect(allworkerUsers[1].email).toBe(userWorker2.email);
      expect(allworkerUsers[0].salary).toBe(userWorker1.salary);
      expect(allworkerUsers[1].salary).toBe(userWorker2.salary);
    });
    it('should remove the user', async () => {
      const response = await repository.delete(userWorker1.id.id);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
