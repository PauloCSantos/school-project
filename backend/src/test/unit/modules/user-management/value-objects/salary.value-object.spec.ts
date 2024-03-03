import Salary from '@/modules/user-management/@shared/domain/value-object/salary.value-object';

describe('Salary unit test', () => {
  describe('On fail', () => {
    it('should throw an error for non-numeric salary', () => {
      expect(() => {
        new Salary({
          //@ts-expect-error
          salary: '1200',
          currency: 'R$',
        });
      }).toThrow('Salary must be greater than zero and be of numeric type');
    });

    it('should throw an error for salary less than or equal to zero', () => {
      expect(() => {
        new Salary({
          salary: 0,
          currency: 'R$',
        });
      }).toThrow('Salary must be greater than zero');
    });

    it('should throw an error for invalid currency', () => {
      expect(() => {
        new Salary({
          salary: 2000,
          //@ts-expect-error
          currency: 'YEN',
        });
      }).toThrow('This currency is not accepted');
    });
  });

  describe('On success', () => {
    it('should create a Salary instance with valid input', () => {
      const salaryInstance = new Salary({
        salary: 1000,
        currency: 'R$',
      });
      expect(salaryInstance).toBeInstanceOf(Salary);
    });

    it('should set default currency if not provided', () => {
      const validSalaryWithoutCurrency = {
        salary: 1500,
      };
      const salaryInstance = new Salary(validSalaryWithoutCurrency);
      expect(salaryInstance.currency).toBe('R$');
    });

    it('should calculate total income with currency symbol and salary', () => {
      const salaryInstance = new Salary({
        salary: 2500,
        currency: '€',
      });
      expect(salaryInstance.calculateTotalIncome()).toBe('€:2500');
    });

    it('should increase salary by a given percentage', () => {
      const salary = new Salary({ salary: 3000, currency: 'R$' });
      salary.increaseSalary(10);
      expect(salary.salary).toBe(3300);
    });

    it('should decrease salary by a given percentage', () => {
      const salary = new Salary({ salary: 4000, currency: '€' });
      salary.decreaseSalary(20);
      expect(salary.salary).toBe(3200);
    });
  });
});
