import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import MemoryUserAdministratorRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/administrator.repository';

describe('MemoryUserAdministratorRepository unit test', () => {
  let repository: MemoryUserAdministratorRepository;

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
  const graduation1 = 'Math';
  const graduation2 = 'English';
  const graduation3 = 'Spanish';

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
  const userAdministrator1 = new UserAdministrator({
    userId: userBase1.id.value,
    salary: salary1,
    graduation: graduation1,
  });
  const userAdministrator2 = new UserAdministrator({
    userId: userBase2.id.value,
    salary: salary2,
    graduation: graduation2,
  });

  beforeEach(() => {
    repository = new MemoryUserAdministratorRepository([
      { masterId, records: [userAdministrator1, userAdministrator2] },
    ]);
  });

  describe('On fail', () => {
    it('should received an null', async () => {
      const userId = new Id().value;
      const userAdministratorFound = await repository.find(masterId, userId);

      expect(userAdministratorFound).toBeNull();
    });
    it('should throw an error when the Id is not found', async () => {
      const userAdministrator = new UserAdministrator({
        id: new Id().value,
        userId: new Id().value,
        graduation: graduation3,
        salary: salary3,
      });

      await expect(repository.update(masterId, userAdministrator)).rejects.toThrow(
        'User not found'
      );
    });
    it('should generate an error when trying to remove the user with the wrong ID', async () => {
      const userAdministrator = new UserAdministrator({
        id: new Id().value,
        userId: new Id().value,
        graduation: graduation3,
        salary: salary3,
      });
      await expect(repository.delete(masterId, userAdministrator)).rejects.toThrow(
        'User not found'
      );
    });
  });
  describe('On success', () => {
    it('should find a user administrator', async () => {
      const userId = userAdministrator1.id.value;
      const userAdministratorFound = await repository.find(masterId, userId);

      expect(userAdministratorFound).toBeDefined();
      expect(userAdministratorFound!.id).toBeDefined();
      expect(userAdministratorFound!.graduation).toStrictEqual(
        userAdministrator1.graduation
      );
      expect(userAdministratorFound!.salary).toStrictEqual(userAdministrator1.salary);
    });
    it('should create a new user and return its id', async () => {
      const userBase = new UserBase({
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
      });
      const userAdministrator = new UserAdministrator({
        userId: userBase.id.value,
        salary: salary3,
        graduation: graduation3,
      });
      const result = await repository.create(masterId, userAdministrator);

      expect(result).toBe(userAdministrator.id.value);
    });
    it('should update a user and return its new informations', async () => {
      const updateduserAdministrator: UserAdministrator = userAdministrator2;
      updateduserAdministrator.salary.currency = '$';

      const result = await repository.update(masterId, updateduserAdministrator);

      expect(result).toEqual(updateduserAdministrator);
    });
    it('should find all the administrators users', async () => {
      const allAdministratorUsers = await repository.findAll(masterId);

      expect(allAdministratorUsers.length).toBe(2);
      expect(allAdministratorUsers[0].salary).toStrictEqual(userAdministrator1.salary);
      expect(allAdministratorUsers[1].salary).toStrictEqual(userAdministrator2.salary);
      expect(allAdministratorUsers[0].userId).toStrictEqual(userAdministrator1.userId);
      expect(allAdministratorUsers[1].userId).toStrictEqual(userAdministrator2.userId);
      expect(allAdministratorUsers[0].graduation).toStrictEqual(
        userAdministrator1.graduation
      );
      expect(allAdministratorUsers[1].graduation).toStrictEqual(
        userAdministrator2.graduation
      );
    });
    it('should remove the user', async () => {
      const response = await repository.delete(masterId, userAdministrator1);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
