import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';

describe('UserTeacher class', () => {
  const validSalary = new Salary({ salary: 5000, currency: 'R$' });
  const id = new Id();
  const address = new Address({
    street: 'Street A',
    city: 'City A',
    zip: '111111-111',
    number: 1,
    avenue: 'Avenue A',
    state: 'State A',
  });
  const name = new Name({
    firstName: 'John',
    middleName: 'David',
    lastName: 'Doe',
  });

  describe('On fail', () => {
    it('should throw an error for invalid graduation format', () => {
      const invalidUser = {
        id,
        name,
        address,
        email: 'teacher@example.com',
        birthday: new Date('11/12/1995'),
        salary: validSalary,
        graduation: 'CS',
        academicDegrees: 'PhD in Physics',
      };
      expect(() => {
        new UserTeacher(invalidUser);
      }).toThrow('Field graduation is not valid');
    });

    it('should throw an error for invalid academic degrees format', () => {
      const invalidUser = {
        id,
        name,
        address,
        email: 'teacher@example.com',
        birthday: new Date('11/12/1995'),
        salary: validSalary,
        graduation: 'Computer Science',
        academicDegrees: 'M',
      };
      expect(() => {
        const a = new UserTeacher(invalidUser);
        console.log(a);
      }).toThrow('Field academic degrees is not valid');
    });
  });

  describe('On success', () => {
    it('should create a UserTeacher instance with valid input', () => {
      const validUser = {
        id,
        name,
        address,
        email: 'teacher@example.com',
        birthday: new Date('11/12/1995'),
        salary: validSalary,
        graduation: 'Computer Science',
        academicDegrees: 'PhD in Physics',
      };
      const userInstance = new UserTeacher(validUser);
      expect(userInstance).toBeInstanceOf(UserTeacher);
    });

    it('should allow setting a valid graduation', () => {
      const user = new UserTeacher({
        id,
        name,
        address,
        email: 'teacher@example.com',
        birthday: new Date('11/12/1995'),
        salary: validSalary,
        graduation: 'Computer Science',
        academicDegrees: 'PhD in Physics',
      });
      const newGraduation = 'Mathematics';
      user.graduation = newGraduation;
      expect(user.graduation).toBe(newGraduation);
    });

    it('should allow setting valid academic degrees', () => {
      const user = new UserTeacher({
        id,
        name,
        address,
        email: 'teacher@example.com',
        birthday: new Date('11/12/1995'),
        salary: validSalary,
        graduation: 'Computer Science',
        academicDegrees: 'PhD in Physics',
      });
      const newAcademicDegrees = 'MSc in Mathematics';
      user.academicDegrees = newAcademicDegrees;
      expect(user.academicDegrees).toBe(newAcademicDegrees);
    });
  });
});
