import Name from '@/modules/user-management/domain/@shared/value-object/name.value-object';

describe('Name unit test', () => {
  describe('On fail', () => {
    it('should throw an error for missing first and last name', () => {
      const invalidName = {
        firstName: undefined,
        lastName: undefined,
      };
      expect(() => {
        //@ts-expect-error
        new Name(invalidName);
      }).toThrow('First and last name are mandatory');
    });

    it('should throw an error for invalid first name', () => {
      const invalidName = {
        firstName: 'J0hn',
        lastName: 'Doe',
      };
      expect(() => {
        new Name(invalidName);
      }).toThrow('The first name field does not meet all requirements');
    });

    it('should throw an error for invalid last name', () => {
      const invalidName = {
        firstName: 'John',
        lastName: '',
      };
      expect(() => {
        new Name(invalidName);
      }).toThrow('The last name field does not meet all requirements');
    });

    it('should throw an error for invalid middle name', () => {
      const invalidName = {
        firstName: 'John',
        middleName: '123',
        lastName: 'Doe',
      };
      expect(() => {
        new Name(invalidName);
      }).toThrow('The middle name field does not meet all requirements');
    });
  });
  describe('On success', () => {
    it('should create a Name instance with valid input', () => {
      const validName = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const nameInstance = new Name(validName);
      expect(nameInstance).toBeInstanceOf(Name);
    });
    it('should create a Name instance with optional middle name', () => {
      const validNameWithMiddle = {
        firstName: 'John',
        middleName: 'Robert',
        lastName: 'Doe',
      };
      const nameInstance = new Name(validNameWithMiddle);
      expect(nameInstance).toBeInstanceOf(Name);
    });
  });
});
