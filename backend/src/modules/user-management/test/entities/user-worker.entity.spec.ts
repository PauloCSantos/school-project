import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

describe('UserWorker unit test', () => {
  const id = new Id().value;
  const userId = new Id().value;
  const validSalary = new Salary({ salary: 5000, currency: 'R$' });

  describe('On success', () => {
    it('should create a UserWorker instance with valid salary', () => {
      const validUser = {
        id,
        userId,
        salary: validSalary,
      };
      const userInstance = new UserWorker(validUser);
      expect(userInstance).toBeInstanceOf(UserWorker);
    });

    it('should return the correct salary object', () => {
      const user = new UserWorker({
        id,
        userId,
        salary: validSalary,
      });
      expect(user.salary).toEqual(validSalary);
    });
  });
});
