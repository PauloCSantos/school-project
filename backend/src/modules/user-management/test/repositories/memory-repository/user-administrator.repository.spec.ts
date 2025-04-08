import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';
import MemoryUserAdministratorRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/administrator.repository';

describe('MemoryUserAdministratorRepository unit test', () => {
  let repository: MemoryUserAdministratorRepository;

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

  const userAdministrator1 = new UserAdministrator({
    name: name1,
    address: address1,
    birthday: birthday1,
    email: email1,
    salary: salary1,
    graduation: graduation1,
  });
  const userAdministrator2 = new UserAdministrator({
    name: name2,
    address: address2,
    birthday: birthday2,
    email: email2,
    salary: salary2,
    graduation: graduation2,
  });

  beforeEach(() => {
    repository = new MemoryUserAdministratorRepository([
      userAdministrator1,
      userAdministrator2,
    ]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const userId = new Id().value;
      const userAdministratorFound = await repository.find(userId);

      expect(userAdministratorFound).toBeUndefined();
    });
    it('should throw an error when the Id is wrong', async () => {
      const userAdministrator = new UserAdministrator({
        id: new Id(),
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
        graduation: graduation3,
        salary: salary3,
      });

      await expect(repository.update(userAdministrator)).rejects.toThrow(
        'User not found'
      );
    });
    it('should generate an error when trying to remove the user with the wrong ID', async () => {
      await expect(repository.delete(new Id().value)).rejects.toThrow(
        'User not found'
      );
    });
  });
  describe('On success', () => {
    it('should find a user administrator', async () => {
      const userId = userAdministrator1.id.value;
      const userAdministratorFound = await repository.find(userId);

      expect(userAdministratorFound).toBeDefined();
      expect(userAdministratorFound!.id).toBeDefined();
      expect(userAdministratorFound!.name).toBe(userAdministrator1.name);
      expect(userAdministratorFound!.address).toBe(userAdministrator1.address);
      expect(userAdministratorFound!.email).toBe(userAdministrator1.email);
      expect(userAdministratorFound!.birthday).toBe(
        userAdministrator1.birthday
      );
      expect(userAdministratorFound!.graduation).toBe(
        userAdministrator1.graduation
      );
      expect(userAdministratorFound!.salary).toBe(userAdministrator1.salary);
    });
    it('should create a new user and return its id', async () => {
      const userAdministrator = new UserAdministrator({
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
        salary: salary3,
        graduation: graduation3,
      });
      const result = await repository.create(userAdministrator);

      expect(result).toBe(userAdministrator.id.value);
    });
    it('should update a user and return its new informations', async () => {
      const updateduserAdministrator: UserAdministrator = userAdministrator2;
      updateduserAdministrator.name.firstName = 'Jane';
      updateduserAdministrator.name.middleName = 'Monza';
      updateduserAdministrator.name.lastName = 'Gueda';
      updateduserAdministrator.address.city = address3.city;
      updateduserAdministrator.address.avenue = address3.avenue;
      updateduserAdministrator.address.number = address3.number;
      updateduserAdministrator.address.state = address3.state;
      updateduserAdministrator.address.zip = address3.zip;
      updateduserAdministrator.address.street = address3.street;

      const result = await repository.update(updateduserAdministrator);

      expect(result).toEqual(updateduserAdministrator);
    });
    it('should find all the administrators users', async () => {
      const allAdministratorUsers = await repository.findAll();

      expect(allAdministratorUsers.length).toBe(2);
      expect(allAdministratorUsers[0].name).toBe(userAdministrator1.name);
      expect(allAdministratorUsers[1].name).toBe(userAdministrator2.name);
      expect(allAdministratorUsers[0].email).toBe(userAdministrator1.email);
      expect(allAdministratorUsers[1].email).toBe(userAdministrator2.email);
      expect(allAdministratorUsers[0].salary).toBe(userAdministrator1.salary);
      expect(allAdministratorUsers[1].salary).toBe(userAdministrator2.salary);
    });
    it('should remove the user', async () => {
      const response = await repository.delete(userAdministrator1.id.value);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
