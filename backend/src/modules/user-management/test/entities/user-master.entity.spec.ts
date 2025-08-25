import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';

describe('UserMaster unit test', () => {
  const id = new Id().value;
  const userId = new Id().value;
  describe('On fail', () => {
    it('should throw an error for invalid CNPJ format', () => {
      const invalidUser = {
        id,
        userId,
        cnpj: '11.111.111/1111-11',
      };
      expect(() => {
        new UserMaster(invalidUser);
      }).toThrow('Field CNPJ is not valid');
    });
    it('should throw an error for setting an invalid CNPJ', () => {
      const user = new UserMaster({
        id,
        userId,
        cnpj: '12.345.678/0001-34',
      });
      const invalidCnpj = '1234567890123445';
      expect(() => {
        user.cnpj = invalidCnpj;
      }).toThrow('Field CNPJ is not valid');
    });
  });

  describe('On success', () => {
    it('should create a UserMaster instance with valid input', () => {
      const validUser = {
        id,
        userId,
        cnpj: '12.345.678/0001-34',
      };
      const userInstance = new UserMaster(validUser);
      expect(userInstance).toBeInstanceOf(UserMaster);
    });
    it('should allow setting a valid CNPJ', () => {
      const validUser = {
        id,
        userId,
        cnpj: '12.345.678/0001-34',
      };
      const userInstance = new UserMaster(validUser);
      const newCnpj = '35.741.901/0001-58';
      userInstance.cnpj = newCnpj;
      expect(userInstance.cnpj).toBe(newCnpj);
    });
  });
});
