import MemoryUserStudentRepository from '@/infraestructure/repositories/user-management-repository/memory-repository/user-student.repository';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import UserStudent from '@/modules/user-management/domain/entity/user-student.entity';

describe('MemoryUserStudentRepository unit test', () => {
  let repository: MemoryUserStudentRepository;

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
  const paymentYear1 = 10000;
  const paymentYear2 = 15000;
  const paymentYear3 = 50000;

  const userStudent1 = new UserStudent({
    name: name1,
    address: address1,
    birthday: birthday1,
    email: email1,
    paymentYear: paymentYear1,
  });
  const userStudent2 = new UserStudent({
    name: name2,
    address: address2,
    birthday: birthday2,
    email: email2,
    paymentYear: paymentYear2,
  });

  beforeEach(() => {
    repository = new MemoryUserStudentRepository([userStudent1, userStudent2]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const userId = new Id().id;
      const userStudentFound = await repository.find(userId);

      expect(userStudentFound).toBeUndefined;
    });
    it('should throw an error when the Id is wrong', async () => {
      const userStudent = new UserStudent({
        id: new Id(),
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
        paymentYear: paymentYear3,
      });

      await expect(repository.update(userStudent)).rejects.toThrow(
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
    it('should find a user student', async () => {
      const userId = userStudent1.id.id;
      const userStudentFound = await repository.find(userId);

      expect(userStudentFound).toBeDefined;
      //@ts-expect-error
      expect(userStudentFound.id).toBeUndefined;
      expect(userStudentFound!.name).toBe(userStudent1.name);
      expect(userStudentFound!.address).toBe(userStudent1.address);
      expect(userStudentFound!.email).toBe(userStudent1.email);
      expect(userStudentFound!.birthday).toBe(userStudent1.birthday);
      expect(userStudentFound!.paymentYear).toBe(userStudent1.paymentYear);
    });
    it('should create a new user and return its id', async () => {
      const userStudent = new UserStudent({
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
        paymentYear: paymentYear3,
      });
      const result = await repository.create(userStudent);

      expect(result).toBe(userStudent.id.id);
    });
    it('should update a user and return its new informations', async () => {
      const updateduserStudent: UserStudent = userStudent2;
      updateduserStudent.name.firstName = 'Jane';
      updateduserStudent.name.middleName = 'Monza';
      updateduserStudent.name.lastName = 'Gueda';
      updateduserStudent.address.city = address3.city;
      updateduserStudent.address.avenue = address3.avenue;
      updateduserStudent.address.number = address3.number;
      updateduserStudent.address.state = address3.state;
      updateduserStudent.address.zip = address3.zip;
      updateduserStudent.address.street = address3.street;

      const result = await repository.update(updateduserStudent);

      expect(result).toEqual(updateduserStudent);
    });
    it('should find all the student users', async () => {
      const allStudentUsers = await repository.findAll();

      expect(allStudentUsers.length).toBe(2);
      expect(allStudentUsers[0].name).toBe(userStudent1.name);
      expect(allStudentUsers[1].name).toBe(userStudent2.name);
      expect(allStudentUsers[0].email).toBe(userStudent1.email);
      expect(allStudentUsers[1].email).toBe(userStudent2.email);
      expect(allStudentUsers[0].paymentYear).toBe(userStudent1.paymentYear);
      expect(allStudentUsers[1].paymentYear).toBe(userStudent2.paymentYear);
    });
    it('should remove the user', async () => {
      const response = await repository.delete(userStudent1.id.id);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
