import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';

describe('UserTeacher class', () => {
  const validSalary = new Salary({ salary: 5000, currency: 'R$' });
  const id = new Id().value;
  const userId = new Id().value;

  describe('On fail', () => {
    it('should throw an error for invalid graduation format', () => {
      const invalidUser = {
        id,
        userId,
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
        userId,
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
        userId,
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
        userId,
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
        userId,
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
