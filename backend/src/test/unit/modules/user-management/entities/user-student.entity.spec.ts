import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Address from '@/modules/user-management/@shared/domain/value-object/address.value-object';
import Name from '@/modules/user-management/@shared/domain/value-object/name.value-object';
import UserStudent from '@/modules/user-management/student/domain/entity/user-student.entity';

describe('UserStudent unit test', () => {
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
    it('should throw an error for invalid paymentYear (less than or equal to zero)', () => {
      const invalidUser = {
        id,
        name,
        email: 'user@example.com',
        address: address,
        birthday: new Date('11-12-1995'),
        paymentYear: 0,
      };
      expect(() => {
        new UserStudent(invalidUser);
      }).toThrow('Field payment is not valid');
    });

    it('should throw an error for setting an invalid paymentYear', () => {
      const user = new UserStudent({
        id,
        name,
        email: 'user@example.com',
        address: address,
        birthday: new Date('11-12-1995'),
        paymentYear: 30000,
      });
      const invalidPaymentYear = 'invalid';
      expect(() => {
        // @ts-expect-error (To simulate a wrong type being set for paymentYear)
        user.paymentYear = invalidPaymentYear;
      }).toThrow('Field payment is not valid');
    });
  });
  describe('On success', () => {
    it('should create a UserStudent instance with valid paymentYear', () => {
      const validUser = {
        id,
        name,
        email: 'user@example.com',
        address: address,
        birthday: new Date('11-12-1995'),
        paymentYear: 80000,
      };
      const userInstance = new UserStudent(validUser);
      expect(userInstance).toBeInstanceOf(UserStudent);
    });
    it('should return payment with currency in Brazilian format', () => {
      const user = new UserStudent({
        id,
        name,
        email: 'user@example.com',
        address: address,
        birthday: new Date('11-12-1995'),
        paymentYear: 80000,
      });
      expect(user.paymentWithCurrencyBR()).toBe('R$ 80000');
    });
  });
});
