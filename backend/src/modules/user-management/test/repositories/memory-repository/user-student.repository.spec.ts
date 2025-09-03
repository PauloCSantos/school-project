import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import MemoryUserStudentRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/student.repository';

describe('MemoryUserStudentRepository unit test', () => {
  let repository: MemoryUserStudentRepository;

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
  const paymentYear1 = 10000;
  const paymentYear2 = 15000;
  const paymentYear3 = 50000;

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
  const userStudent1 = new UserStudent({
    userId: userBase1.id.value,
    paymentYear: paymentYear1,
  });
  const userStudent2 = new UserStudent({
    userId: userBase2.id.value,
    paymentYear: paymentYear2,
  });

  beforeEach(() => {
    repository = new MemoryUserStudentRepository([
      { masterId, records: [userStudent1, userStudent2] },
    ]);
  });

  describe('On fail', () => {
    it('should received an null', async () => {
      const userId = new Id().value;
      const userStudentFound = await repository.find(masterId, userId);

      expect(userStudentFound).toBeNull();
    });
    it('should throw an error when the Id is wrong', async () => {
      const userStudent = new UserStudent({
        id: new Id().value,
        userId: new Id().value,
        paymentYear: paymentYear3,
      });

      await expect(repository.update(masterId, userStudent)).rejects.toThrow(
        'User not found'
      );
    });
    it('should generate an error when trying to remove the user with the wrong ID', async () => {
      const userStudent = new UserStudent({
        id: new Id().value,
        userId: new Id().value,
        paymentYear: paymentYear3,
      });
      await expect(repository.delete(masterId, userStudent)).rejects.toThrow(
        'User not found'
      );
    });
  });
  describe('On success', () => {
    it('should find a user student', async () => {
      const userId = userStudent1.id.value;
      const userStudentFound = await repository.find(masterId, userId);

      expect(userStudentFound).toBeDefined();
      expect(userStudentFound!.id).toBeDefined();
      expect(userStudentFound!.userId).toStrictEqual(userStudent1.userId);
      expect(userStudentFound!.paymentYear).toStrictEqual(userStudent1.paymentYear);
    });
    it('should create a new user and return its id', async () => {
      const userBase = new UserBase({
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
      });
      const userStudent = new UserStudent({
        userId: userBase.id.value,
        paymentYear: paymentYear3,
      });
      const result = await repository.create(masterId, userStudent);

      expect(result).toBe(userStudent.id.value);
    });
    it('should update a user and return its new informations', async () => {
      const updateduserStudent: UserStudent = userStudent2;
      updateduserStudent.paymentYear = 99000;

      const result = await repository.update(masterId, updateduserStudent);

      expect(result).toEqual(updateduserStudent);
    });
    it('should find all the student users', async () => {
      const allStudentUsers = await repository.findAll(masterId);

      expect(allStudentUsers.length).toBe(2);
      expect(allStudentUsers[0].userId).toStrictEqual(userStudent1.userId);
      expect(allStudentUsers[1].userId).toStrictEqual(userStudent2.userId);
      expect(allStudentUsers[0].paymentYear).toStrictEqual(userStudent1.paymentYear);
      expect(allStudentUsers[1].paymentYear).toStrictEqual(userStudent2.paymentYear);
    });
    it('should remove the user', async () => {
      const response = await repository.delete(masterId, userStudent1);

      expect(response).toBe('Operation completed successfully');
    });
  });
});
