import {
  isAlpha,
  isGreaterZero,
  isNotEmpty,
  isNumeric,
  maxLengthInclusive,
  minLength,
  validBirthday,
  validCNPJ,
  validCurrency,
  validEmail,
} from '@/util/validations';

describe('Testing validation functions', () => {
  describe('Testing isNotEmpty', () => {
    it('isNotEmpty should return false for an empty string', () => {
      expect(isNotEmpty('')).toBe(false);
    });
    it('isNotEmpty should return true for a non-empty string', () => {
      expect(isNotEmpty('Test')).toBe(true);
    });
  });

  describe('Testing isAlpha', () => {
    it('isAlpha should return false for non-alphabetic strings', () => {
      expect(isAlpha('123')).toBe(false);
    });
    it('isAlpha should return true for alphabetic strings', () => {
      expect(isAlpha('ABC')).toBe(true);
    });
    it('isAlpha should return true for alphabetic strings', () => {
      expect(isAlpha('ABC D')).toBe(true);
    });
  });

  describe('Testing maxLengthInclusive', () => {
    it('maxLengthInclusive should return false for a string with length greater than the specified maximum length', () => {
      expect(maxLengthInclusive('Test', 2)).toBe(false);
    });
    it('maxLengthInclusive should return true for a string with length less than or equal to the specified maximum length', () => {
      expect(maxLengthInclusive('Test', 10)).toBe(true);
    });
  });

  describe('Testing minLength', () => {
    it('minLength should return false for a string with length less than or equal to the specified minimum length', () => {
      expect(minLength('T', 2)).toBe(false);
    });
    it('minLength should return true for a string with length greater than the specified minimum length', () => {
      expect(minLength('Test', 2)).toBe(true);
    });
  });

  describe('Testing isNumeric', () => {
    it('isNumeric should return false for non-numeric values', () => {
      //@ts-expect-error
      expect(isNumeric('abc')).toBe(false);
    });
    it('isNumeric should return true for numeric values', () => {
      expect(isNumeric(123)).toBe(true);
    });
  });

  describe('Testing isGreaterZero', () => {
    it('isGreaterZero should return false for values less than or equal to zero', () => {
      expect(isGreaterZero(0)).toBe(false);
      expect(isGreaterZero(-5)).toBe(false);
    });
    it('isGreaterZero should return true for values greater than zero', () => {
      expect(isGreaterZero(5)).toBe(true);
    });
  });

  describe('Testing validCurrency', () => {
    it('validCurrency should return false for invalid currency values', () => {
      //@ts-expect-error
      expect(validCurrency('YEN')).toBe(false);
    });
    it('validCurrency should return true for valid currency values', () => {
      expect(validCurrency('R$')).toBe(true);
      expect(validCurrency('€')).toBe(true);
      expect(validCurrency('$')).toBe(true);
    });
  });

  describe('Testing validEmail', () => {
    it('validEmail should return false for invalid email addresses', () => {
      expect(validEmail('invalidemail@')).toBe(false);
      expect(validEmail('notanemail.com')).toBe(false);
    });
    it('validEmail should return true for valid email addresses', () => {
      expect(validEmail('test@example.com')).toBe(true);
      expect(validEmail('another.email@test.co')).toBe(true);
    });
  });

  describe('Testing validBirthday', () => {
    it('validBirthday should return false for future dates', () => {
      expect(validBirthday(new Date('2050-01-01'))).toBe(false);
    });
    it('validBirthday should return true for valid dates', () => {
      expect(validBirthday(new Date('1990-01-01'))).toBe(true);
    });
  });

  describe('Testing validCNPJ', () => {
    it('validCNPJ should return false for invalid CNPJ length', () => {
      expect(validCNPJ('11.222.333/4444')).toBe(false);
    });
    it('validCNPJ should return false for invalid CNPJ length', () => {
      expect(validCNPJ('11.222.333/4444-555')).toBe(false);
    });
    it('validCNPJ should return false for invalid CNPJ equal numbers', () => {
      expect(validCNPJ('22.222.222/2222-22')).toBe(false);
    });
    it('validCNPJ should return true for valid CNPJ numbers', () => {
      expect(validCNPJ('12.345.678/0001-90')).toBe(true);
    });
    it('validCNPJ should return true for valid CNPJ numbers', () => {
      expect(validCNPJ('33.050.196/0001-88')).toBe(true);
    });
  });
});
