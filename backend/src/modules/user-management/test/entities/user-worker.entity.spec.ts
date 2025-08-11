import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';
import Salary from '@/modules/user-management/domain/@shared/value-object/salary.value-object';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

describe('UserWorker unit test', () => {
  const validSalary = new Salary({ salary: 5000, currency: 'R$' });
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

  describe('On success', () => {
    it('should create a UserWorker instance with valid salary', () => {
      const validUser = {
        name,
        email: 'worker@example.com',
        birthday: new Date('11/12/1995'),
        address,
        salary: validSalary,
      };
      const userInstance = new UserWorker(validUser);
      expect(userInstance).toBeInstanceOf(UserWorker);
    });

    it('should return the correct salary object', () => {
      const user = new UserWorker({
        name,
        email: 'worker@example.com',
        birthday: new Date('11/12/1995'),
        address,
        salary: validSalary,
      });
      expect(user.salary).toEqual(validSalary);
    });
  });
});
