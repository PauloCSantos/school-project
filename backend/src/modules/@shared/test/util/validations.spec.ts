import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  isAlpha,
  isGreaterZero,
  isNotEmpty,
  isNumeric,
  maxLengthInclusive,
  minLength,
  validDate,
  validCNPJ,
  validCurrency,
  validEmail,
  validId,
  areAllValuesUnique,
  validHour24h,
  validDay,
  validNote,
  isString,
  validRole,
} from '../../utils/validations';

describe('Testing validation functions', () => {
  describe('Testing isNotEmpty', () => {
    it('should return false for empty string', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty(' ')).toBe(true);
      //@ts-expect-error
      expect(isNotEmpty(undefined)).toBe(false);
    });
    it('should return true for non-empty string', () => {
      expect(isNotEmpty('Test')).toBe(true);
    });
  });

  describe('Testing isAlpha', () => {
    it('should return false for non-alphabetic', () => {
      expect(isAlpha('123')).toBe(false);
      //@ts-expect-error
      expect(isAlpha(undefined)).toBe(false);
    });
    it('should return true for alphabetic', () => {
      expect(isAlpha('ABC')).toBe(true);
      expect(isAlpha('Name Test')).toBe(true);
    });
  });

  describe('Testing maxLengthInclusive', () => {
    it('should return false for strings longer than max', () => {
      expect(maxLengthInclusive('Test', 2)).toBe(false);
    });
    it('should return true for strings within max length', () => {
      expect(maxLengthInclusive('Test', 10)).toBe(true);
    });
  });

  describe('Testing minLength', () => {
    it('should return false for strings shorter than min', () => {
      expect(minLength('T', 2)).toBe(false);
    });
    it('should return true for strings longer or equal to min', () => {
      expect(minLength('Test', 2)).toBe(true);
    });
  });

  describe('Testing isNumeric', () => {
    it('should return false for non-numbers', () => {
      //@ts-expect-error
      expect(isNumeric('abc')).toBe(false);
    });
    it('should return true for numbers', () => {
      expect(isNumeric(123)).toBe(true);
    });
  });

  describe('Testing isGreaterZero', () => {
    it('should return false for 0 or negative numbers', () => {
      expect(isGreaterZero(0)).toBe(false);
      expect(isGreaterZero(-5)).toBe(false);
    });
    it('should return true for positive numbers', () => {
      expect(isGreaterZero(5)).toBe(true);
    });
  });

  describe('Testing validCurrency', () => {
    it('should return false for invalid currency', () => {
      //@ts-expect-error
      expect(validCurrency('YEN')).toBe(false);
    });
    it('should return true for valid currency', () => {
      expect(validCurrency('R$')).toBe(true);
      expect(validCurrency('€')).toBe(true);
      expect(validCurrency('$')).toBe(true);
    });
  });

  describe('Testing validEmail', () => {
    it('should return false for invalid email', () => {
      expect(validEmail('invalidemail@')).toBe(false);
      expect(validEmail('notanemail.com')).toBe(false);
    });
    it('should return true for valid email', () => {
      expect(validEmail('test@example.com')).toBe(true);
    });
  });

  describe('Testing validDate', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it('should return false for future dates', () => {
      expect(validDate(new Date('2050-01-01'))).toBe(false);
    });
    it('should return true for past or current dates', () => {
      expect(validDate(new Date('1990-01-01'))).toBe(true);
      expect(validDate(new Date('2020-01-01'))).toBe(true);
    });
    it('should return false for invalid Date objects', () => {
      //@ts-expect-error
      expect(validDate('not-a-date')).toBe(false);
    });
  });

  describe('Testing validCNPJ', () => {
    it('should return false for invalid CNPJ length or repeated digits', () => {
      expect(validCNPJ('11.222.333/4444')).toBe(false);
      expect(validCNPJ('11.222.333/4444-555')).toBe(false);
      expect(validCNPJ('22.222.222/2222-22')).toBe(false);
    });
    it('should return true for valid CNPJ', () => {
      expect(validCNPJ('12.345.678/0001-90')).toBe(true);
      expect(validCNPJ('33.050.196/0001-88')).toBe(true);
    });
  });

  describe('Testing validId', () => {
    it('should return false for invalid id', () => {
      expect(validId('invalidID')).toBe(false);
      //@ts-expect-error
      expect(validId(123)).toBe(false);
    });
    it('should return true for valid UUID', () => {
      expect(validId(new Id().value)).toBe(true);
    });
  });

  describe('Testing areAllValuesUnique', () => {
    it('should return false for arrays with duplicates', () => {
      expect(areAllValuesUnique(['1', '1', '2'])).toBe(false);
    });
    it('should return true for unique values', () => {
      expect(areAllValuesUnique(['1', '2', '3'])).toBe(true);
    });
  });

  describe('Testing validHour24h', () => {
    it('should return false for invalid hours', () => {
      expect(validHour24h('29:72')).toBe(false);
    });
    it('should return true for valid 24h time', () => {
      expect(validHour24h('13:25')).toBe(true);
    });
  });

  describe('Testing validDay', () => {
    it('should return false for invalid day', () => {
      expect(validDay('sunday')).toBe(false);
      //@ts-expect-error
      expect(validDay(1)).toBe(false);
      //@ts-expect-error
      expect(validDay(false)).toBe(false);
      //@ts-expect-error
      expect(validDay(undefined)).toBe(false);
    });
    it('should return true for valid short days', () => {
      expect(validDay('sun')).toBe(true);
    });
  });

  describe('Testing validNote', () => {
    it('should return false for out-of-range or invalid types', () => {
      expect(validNote(11)).toBe(false);
      expect(validNote(-1)).toBe(false);
      //@ts-expect-error
      expect(validNote('asd')).toBe(false);
    });
    it('should return true for valid note', () => {
      expect(validNote(10)).toBe(true);
    });
  });

  describe('Testing isString', () => {
    it('should return false for non-strings', () => {
      //@ts-expect-error
      expect(isString(123)).toBe(false);
      //@ts-expect-error
      expect(isString(undefined)).toBe(false);
      //@ts-expect-error
      expect(isString(true)).toBe(false);
      //@ts-expect-error
      expect(isString(new Date())).toBe(false);
    });
    it('should return true for strings', () => {
      expect(isString('')).toBe(true);
      expect(isString('string')).toBe(true);
    });
  });

  describe('Testing validRole', () => {
    it('should return false for invalid roles', () => {
      //@ts-expect-error
      expect(validRole(123)).toBe(false);
      //@ts-expect-error
      expect(validRole(undefined)).toBe(false);
      //@ts-expect-error
      expect(validRole(true)).toBe(false);
      expect(validRole('')).toBe(false);
      expect(validRole('Student')).toBe(false);
    });
    it('should return true for valid roles', () => {
      expect(validRole('master')).toBe(true);
      expect(validRole('teacher')).toBe(true);
    });
  });
});
