import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';
import MemoryUserTeacherRepository from '@/modules/user-management/infrastructure/repositories/memory-repository/teacher.repository';

describe('MemoryUserTeacherRepository unit test', () => {
  let repository: MemoryUserTeacherRepository;

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

  const userTeacher1 = new UserTeacher({
    name: name1,
    address: address1,
    birthday: birthday1,
    email: email1,
    salary: salary1,
    graduation: graduation1,
    academicDegrees: academicDegrees1,
  });
  const userTeacher2 = new UserTeacher({
    name: name2,
    address: address2,
    birthday: birthday2,
    email: email2,
    salary: salary2,
    graduation: graduation2,
    academicDegrees: academicDegrees2,
  });

  beforeEach(() => {
    repository = new MemoryUserTeacherRepository([userTeacher1, userTeacher2]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const userId = new Id().value;
      const userTeacherFound = await repository.find(userId);

      expect(userTeacherFound).toBeUndefined();
    });
    it('should throw an error when the Id is wrong', async () => {
      const userTeacher = new UserTeacher({
        id: new Id(),
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
        graduation: graduation3,
        salary: salary3,
        academicDegrees: academicDegrees3,
      });

      await expect(repository.update(userTeacher)).rejects.toThrow(
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
    it('should find a user teacher', async () => {
      const userId = userTeacher1.id.value;
      const userTeacherFound = await repository.find(userId);

      expect(userTeacherFound).toBeDefined();
      expect(userTeacherFound!.id).toBeDefined();
      expect(userTeacherFound!.name).toBe(userTeacher1.name);
      expect(userTeacherFound!.address).toBe(userTeacher1.address);
      expect(userTeacherFound!.email).toBe(userTeacher1.email);
      expect(userTeacherFound!.birthday).toBe(userTeacher1.birthday);
      expect(userTeacherFound!.graduation).toBe(userTeacher1.graduation);
      expect(userTeacherFound!.salary).toBe(userTeacher1.salary);
    });
    it('should create a new user and return its id', async () => {
      const userTeacher = new UserTeacher({
        name: name3,
        address: address3,
        birthday: birthday3,
        email: email3,
        salary: salary3,
        graduation: graduation3,
        academicDegrees: academicDegrees3,
      });
      const result = await repository.create(userTeacher);

      expect(result).toBe(userTeacher.id.value);
    });
    it('should update a user and return its new informations', async () => {
      const updateduserTeacher: UserTeacher = userTeacher2;
      updateduserTeacher.name.firstName = 'Jane';
      updateduserTeacher.name.middleName = 'Monza';
      updateduserTeacher.name.lastName = 'Gueda';
      updateduserTeacher.address.city = address3.city;
      updateduserTeacher.address.avenue = address3.avenue;
      updateduserTeacher.address.number = address3.number;
      updateduserTeacher.address.state = address3.state;
      updateduserTeacher.address.zip = address3.zip;
      updateduserTeacher.address.street = address3.street;

      const result = await repository.update(updateduserTeacher);

      expect(result).toEqual(updateduserTeacher);
    });
    it('should find all the teacher users', async () => {
      const allTeacherUsers = await repository.findAll();

      expect(allTeacherUsers.length).toBe(2);
      expect(allTeacherUsers[0].name).toBe(userTeacher1.name);
      expect(allTeacherUsers[1].name).toBe(userTeacher2.name);
      expect(allTeacherUsers[0].email).toBe(userTeacher1.email);
      expect(allTeacherUsers[1].email).toBe(userTeacher2.email);
      expect(allTeacherUsers[0].salary).toBe(userTeacher1.salary);
      expect(allTeacherUsers[1].salary).toBe(userTeacher2.salary);
    });
    it('should remove the user', async () => {
      const response = await repository.delete(userTeacher1.id.value);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
