import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';

describe('UserAdministrator unit test', () => {
  const validSalary = new Salary({ salary: 5000, currency: 'R$' });
  const userId = new Id().value;

  describe('On fail', () => {
    it('should throw an error for invalid graduation format', () => {
      const invalidUser = {
        userId,
        salary: validSalary,
        graduation: 'CS',
      };
      expect(() => {
        new UserAdministrator(invalidUser);
      }).toThrow('Field graduation is not valid');
    });
    it('should throw an error for setting an invalid graduation', () => {
      const user = new UserAdministrator({
        userId,
        salary: validSalary,
        graduation: 'Computer Science',
      });
      const invalidGraduation = '';
      expect(() => {
        user.graduation = invalidGraduation;
      }).toThrow('Field graduation is not valid');
    });
  });

  describe('On success', () => {
    it('should create a UserAdministrator instance with valid input', () => {
      const validUser = {
        userId,
        salary: validSalary,
        graduation: 'Computer Science',
      };
      const userInstance = new UserAdministrator(validUser);
      expect(userInstance).toBeInstanceOf(UserAdministrator);
    });

    it('should allow setting a valid graduation', () => {
      const user = new UserAdministrator({
        userId,
        salary: validSalary,
        graduation: 'Computer Science',
      });
      const newGraduation = 'Electrical Engineering';
      user.graduation = newGraduation;
      expect(user.graduation).toBe(newGraduation);
    });
  });
});
