import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import MemoryUserTeacherRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/teacher.repository';

describe('MemoryUserTeacherRepository unit test', () => {
  let repository: MemoryUserTeacherRepository;

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
  const academicDegrees1 = 'Msc';
  const academicDegrees2 = 'Dr';
  const academicDegrees3 = 'Esp';

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

  const userTeacher1 = new UserTeacher({
    userId: userBase1.id.value,
    salary: salary1,
    graduation: graduation1,
    academicDegrees: academicDegrees1,
  });
  const userTeacher2 = new UserTeacher({
    userId: userBase2.id.value,
    salary: salary2,
    graduation: graduation2,
    academicDegrees: academicDegrees2,
  });

  beforeEach(() => {
    repository = new MemoryUserTeacherRepository([
      { masterId, records: [userTeacher1, userTeacher2] },
    ]);
  });

  describe('On fail', () => {
    it('should received an null', async () => {
      const userId = new Id().value;
      const userTeacherFound = await repository.find(masterId, userId);

      expect(userTeacherFound).toBeNull();
    });
    it('should throw an error when the Id is wrong', async () => {
      const userTeacher = new UserTeacher({
        id: new Id().value,
        userId: new Id().value,
        graduation: graduation3,
        salary: salary3,
        academicDegrees: academicDegrees3,
      });

      await expect(repository.update(masterId, userTeacher)).rejects.toThrow(
        'User not found'
      );
    });
    it('should generate an error when trying to remove the user with the wrong ID', async () => {
      const userTeacher = new UserTeacher({
        id: new Id().value,
        userId: new Id().value,
        graduation: graduation3,
        salary: salary3,
        academicDegrees: academicDegrees3,
      });
      await expect(repository.delete(masterId, userTeacher)).rejects.toThrow(
        'User not found'
      );
    });
    it('should receive null when searching for a non-existent user id', async () => {
      const baseUserId = new Id().value;
      const userTeacherFound = await repository.findByBaseUserId(masterId, baseUserId);

      expect(userTeacherFound).toBeNull();
    });
  });
  describe('On success', () => {
    it('should find a user teacher', async () => {
      const userId = userTeacher1.id.value;
      const userTeacherFound = await repository.find(masterId, userId);

      expect(userTeacherFound).toBeDefined();
      expect(userTeacherFound!.id).toBeDefined();
      expect(userTeacherFound!.userId).toStrictEqual(userTeacher1.userId);
      expect(userTeacherFound!.graduation).toStrictEqual(userTeacher1.graduation);
      expect(userTeacherFound!.salary).toStrictEqual(userTeacher1.salary);
    });
    it('should create a new user and return its id', async () => {
      const userBase = new UserBase({
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
      });
      const userTeacher = new UserTeacher({
        userId: userBase.id.value,
        salary: salary3,
        graduation: graduation3,
        academicDegrees: academicDegrees3,
      });
      const result = await repository.create(masterId, userTeacher);

      expect(result).toBe(userTeacher.id.value);
    });
    it('should update a user and return its new informations', async () => {
      const updateduserTeacher: UserTeacher = userTeacher2;
      updateduserTeacher.salary.increaseSalary(10);
      updateduserTeacher.graduation = graduation3;
      updateduserTeacher.academicDegrees = academicDegrees3;

      const result = await repository.update(masterId, updateduserTeacher);

      expect(result).toEqual(updateduserTeacher);
    });
    it('should find all the teacher users', async () => {
      const allTeacherUsers = await repository.findAll(masterId);

      expect(allTeacherUsers.length).toBe(2);
      expect(allTeacherUsers[0].userId).toStrictEqual(userTeacher1.userId);
      expect(allTeacherUsers[1].userId).toStrictEqual(userTeacher2.userId);
      expect(allTeacherUsers[0].graduation).toStrictEqual(userTeacher1.graduation);
      expect(allTeacherUsers[1].graduation).toStrictEqual(userTeacher2.graduation);
      expect(allTeacherUsers[0].salary).toStrictEqual(userTeacher1.salary);
      expect(allTeacherUsers[1].salary).toStrictEqual(userTeacher2.salary);
    });
    it('should remove the user', async () => {
      const response = await repository.delete(masterId, userTeacher1);

      expect(response).toBe('Operation completed successfully');
    });
    it('should find a user teacher by the base user id', async () => {
      const baseUserId = userTeacher1.userId;
      const userTeacherFound = await repository.findByBaseUserId(masterId, baseUserId);

      expect(userTeacherFound).toBeDefined();
      expect(userTeacherFound!.id).toBeDefined();
      expect(userTeacherFound!.id).toStrictEqual(userTeacher1.id);
      expect(userTeacherFound!.userId).toStrictEqual(userTeacher1.userId);
      expect(userTeacherFound!.salary).toStrictEqual(userTeacher1.salary);
    });
  });
});
