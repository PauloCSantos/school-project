import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';

describe('UserStudent unit test', () => {
  const id = new Id().value;
  const userId = new Id().value;
  describe('On fail', () => {
    it('should throw an error for invalid paymentYear (less than or equal to zero)', () => {
      const invalidUser = {
        id,
        userId,
        paymentYear: 0,
      };
      expect(() => {
        new UserStudent(invalidUser);
      }).toThrow('Field payment is not valid');
    });

    it('should throw an error for setting an invalid paymentYear', () => {
      const user = new UserStudent({
        id,
        userId,
        paymentYear: 30000,
      });
      const invalidPaymentYear = 'invalid';
      expect(() => {
        // @ts-expect-error
        user.paymentYear = invalidPaymentYear;
      }).toThrow('Field payment is not valid');
    });
  });
  describe('On success', () => {
    it('should create a UserStudent instance with valid paymentYear', () => {
      const validUser = {
        id,
        userId,
        paymentYear: 80000,
      };
      const userInstance = new UserStudent(validUser);
      expect(userInstance).toBeInstanceOf(UserStudent);
    });
    it('should return payment with currency in Brazilian format', () => {
      const user = new UserStudent({
        id,
        userId,
        paymentYear: 80000,
      });
      expect(user.paymentWithCurrencyBR()).toBe('R$ 80000');
    });
  });
});
