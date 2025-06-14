import Id, {
  InvalidIdError,
} from '../../../@shared/domain/value-object/id.value-object';
import * as validations from '../../../@shared/utils/validations';
import { randomUUID } from 'crypto';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

jest.mock('../../../@shared/utils/validations', () => ({
  validId: jest.fn(),
}));

describe('Id Value Object', () => {
  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    (randomUUID as jest.Mock).mockReturnValue(mockUuid);
    (validations.validId as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create an ID with generated UUID when none is provided', () => {
      const id = new Id();
      expect(id.value).toBe(mockUuid);
      expect(randomUUID).toHaveBeenCalledTimes(1);
    });

    it('should accept a provided valid UUID', () => {
      const id = new Id(mockUuid);
      expect(id.value).toBe(mockUuid);
      expect(randomUUID).not.toHaveBeenCalled();
    });

    it('should throw an error for invalid UUID', () => {
      (validations.validId as jest.Mock).mockReturnValueOnce(false);
      expect(() => new Id('invalid-uuid')).toThrow(InvalidIdError);
    });

    it('should throw an error when ID is not a string', () => {
      // @ts-expect-error
      expect(() => new Id(123)).toThrow(InvalidIdError);
      expect(() => new Id(123 as unknown as string)).toThrow(
        'ID must be a string'
      );
    });

    it('should be immutable', () => {
      const id = new Id(mockUuid);
      expect(() => {
        // @ts-expect-error
        id._value = 'something-else';
      }).toThrow(TypeError);
    });
  });

  describe('value getter', () => {
    it('should return the ID value', () => {
      const id = new Id(mockUuid);
      expect(id.value).toBe(mockUuid);
    });
  });

  describe('equals', () => {
    it('should return true for IDs with the same value', () => {
      const id1 = new Id(mockUuid);
      const id2 = new Id(mockUuid);
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for IDs with different values', () => {
      const id1 = new Id(mockUuid);
      const id2 = new Id('f47ac10b-58cc-4372-a567-0e02b2c3d479');
      expect(id1.equals(id2)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      const id = new Id(mockUuid);
      expect(id.equals(null)).toBe(false);
      expect(id.equals(undefined)).toBe(false);
    });

    it('should return false for different types', () => {
      const id = new Id(mockUuid);
      expect(id.equals('any-string')).toBe(false);
      expect(id.equals(123)).toBe(false);
      expect(id.equals({ value: mockUuid })).toBe(false);
    });
  });

  describe('static create', () => {
    it('should create a new ID with a generated UUID', () => {
      const id = Id.create();
      expect(id.value).toBe(mockUuid);
      expect(randomUUID).toHaveBeenCalledTimes(1);
    });
  });

  describe('static isValid', () => {
    it('should return true for a valid UUID string', () => {
      (validations.validId as jest.Mock).mockReturnValueOnce(true);
      expect(Id.isValid(mockUuid)).toBe(true);
      expect(validations.validId).toHaveBeenCalledWith(mockUuid);
    });

    it('should return false for an invalid UUID string', () => {
      (validations.validId as jest.Mock).mockReturnValueOnce(false);
      expect(Id.isValid('not-a-uuid')).toBe(false);
    });

    it('should return false for non-string values', () => {
      // @ts-expect-error
      expect(Id.isValid(123)).toBe(false);
      // @ts-expect-error
      expect(Id.isValid(null)).toBe(false);
      // @ts-expect-error
      expect(Id.isValid(undefined)).toBe(false);
    });
  });

  describe('Value Object behavior', () => {
    it('should support identity comparison between instances', () => {
      const id1 = new Id(mockUuid);
      const id2 = new Id(mockUuid);

      expect(id1).not.toBe(id2);
      expect(id1.equals(id2)).toBe(true);
    });

    it('should remain immutable', () => {
      const id = new Id(mockUuid);
      expect(Object.isFrozen(id)).toBe(true);
    });
  });
});
