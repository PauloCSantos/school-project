import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UserBase, {
  UserBaseProps,
} from '@/modules/user-management/domain/@shared/entity/user-base.entity';
import Address from '@/modules/user-management/domain/@shared/value-object/address.value-object';
import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';

describe('UserBase unit test', () => {
  class UserMock extends UserBase {
    constructor(input: UserBaseProps) {
      super(input);
    }
  }
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
  const userBase: UserBaseProps = {
    id: id,
    name: name,
    address: address,
    email: 'john@example.com',
    birthday: new Date('1990-01-01'),
  };

  describe('On fail', () => {
    it('should throw an error for an invalid email', () => {
      const invalidEmailProps = { ...userBase, email: 'invalid-email' };
      expect(() => new UserMock(invalidEmailProps)).toThrow(
        'Field email is not valid'
      );
    });
    it('should throw an error when setting an invalid email', () => {
      const user = new UserMock(userBase);
      expect(() => (user.email = 'invalid-email')).toThrow(
        'Field email is not valid'
      );
    });
    it('should throw an error for an invalid birthday', () => {
      const invalidBirthdayProps = {
        ...userBase,
        birthday: new Date('2026-01-06'),
      };
      expect(() => new UserMock(invalidBirthdayProps)).toThrow(
        'Field birthday is not valid'
      );
    });
    it('should throw an error when setting an invalid birthday', () => {
      const user = new UserMock(userBase);
      expect(() => (user.birthday = new Date('2026-01-06'))).toThrow(
        'Field birthday is not valid'
      );
    });
  });

  describe('On success', () => {
    it('should create a user instance with valid input', () => {
      const user = new UserMock(userBase);
      expect(user).toBeInstanceOf(UserMock);
      expect(user.id).toBe(userBase.id);
      expect(user.name).toBe(userBase.name);
      expect(user.address).toBe(userBase.address);
      expect(user.email).toBe(userBase.email);
      expect(user.birthday).toBe(userBase.birthday);
    });
    it('should update birthday when setting a valid date', () => {
      const user = new UserMock(userBase);
      const newBirthday = new Date('1995-01-01');
      user.birthday = newBirthday;
      expect(user.birthday).toEqual(newBirthday);
    });
    it('should update email when setting a valid input', () => {
      const user = new UserMock(userBase);
      const newEmail = 'john2@example.com';
      user.email = newEmail;
      expect(user.email).toEqual(newEmail);
    });
  });
});
