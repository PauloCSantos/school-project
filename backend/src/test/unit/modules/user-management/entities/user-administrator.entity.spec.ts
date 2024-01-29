import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';
import UserAdministrator from '@/modules/user-management/domain/entity/user-administrator.entity';

describe('UserAdministrator unit test', () => {
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
        email: 'admin@example.com',
        birthday: new Date('11-12-1995'),
        salary: validSalary,
        graduation: 'CS',
      };
      expect(() => {
        new UserAdministrator(invalidUser);
      }).toThrow('Field graduation is not valid');
    });
    it('should throw an error for setting an invalid graduation', () => {
      const user = new UserAdministrator({
        id,
        name,
        email: 'admin@example.com',
        address,
        salary: validSalary,
        birthday: new Date('11-12-1995'),
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
        id,
        name,
        email: 'admin@example.com',
        address,
        salary: validSalary,
        birthday: new Date('11-12-1995'),
        graduation: 'Computer Science',
      };
      const userInstance = new UserAdministrator(validUser);
      expect(userInstance).toBeInstanceOf(UserAdministrator);
    });

    it('should allow setting a valid graduation', () => {
      const user = new UserAdministrator({
        id,
        name,
        email: 'admin@example.com',
        address,
        salary: validSalary,
        birthday: new Date('11-12-1995'),
        graduation: 'Computer Science',
      });
      const newGraduation = 'Electrical Engineering';
      user.graduation = newGraduation;
      expect(user.graduation).toBe(newGraduation);
    });
  });
});
