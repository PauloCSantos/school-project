// src/modules/@shared/test/value-object/id.value-object.spec.ts
import Id, {
  InvalidIdError,
} from '../../../@shared/domain/value-object/id.value-object';
import * as validations from '../../../@shared/utils/validations';
import { randomUUID } from 'crypto';

// Mock imports
jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

// Mock validId function
jest.mock('../../../@shared/utils/validations', () => ({
  validId: jest.fn(),
}));

describe('Id Value Object', () => {
  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
  const nilUuid = '00000000-0000-0000-0000-000000000000';

  beforeEach(() => {
    // Set up mock to return a deterministic UUID
    (randomUUID as jest.Mock).mockReturnValue(mockUuid);

    // Set up mock to make validId return true by default
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
      // @ts-expect-error - Testing runtime type validation
      expect(() => new Id(123)).toThrow(InvalidIdError);
      expect(() => new Id(123 as unknown as string)).toThrow(
        'ID must be a string'
      );
    });

    it('should be immutable', () => {
      const id = new Id(mockUuid);
      expect(() => {
        // @ts-expect-error - Testing immutability
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

  describe('toString', () => {
    it('should return string representation of the ID', () => {
      const id = new Id(mockUuid);
      expect(id.toString()).toBe(mockUuid);
    });
  });

  describe('toJSON', () => {
    it('should return the ID value for JSON serialization', () => {
      const id = new Id(mockUuid);
      expect(id.toJSON()).toBe(mockUuid);

      // Testing real serialization
      const obj = { id };
      expect(JSON.stringify(obj)).toBe(`{"id":"${mockUuid}"}`);
    });
  });

  describe('hashCode', () => {
    it('should return the same hashcode for equal IDs', () => {
      const id1 = new Id(mockUuid);
      const id2 = new Id(mockUuid);
      expect(id1.hashCode()).toBe(id2.hashCode());
    });

    it('should return different hashcodes for different IDs', () => {
      const id1 = new Id(mockUuid);
      const id2 = new Id('f47ac10b-58cc-4372-a567-0e02b2c3d479');
      expect(id1.hashCode()).not.toBe(id2.hashCode());
    });

    it('should return a number', () => {
      const id = new Id(mockUuid);
      expect(typeof id.hashCode()).toBe('number');
    });
  });

  describe('isNil', () => {
    it('should return true for nil UUID', () => {
      const id = new Id(nilUuid);
      expect(id.isNil()).toBe(true);
    });

    it('should return false for non-nil UUID', () => {
      const id = new Id(mockUuid);
      expect(id.isNil()).toBe(false);
    });
  });

  describe('static create', () => {
    it('should create a new ID with a generated UUID', () => {
      const id = Id.create();
      expect(id.value).toBe(mockUuid);
      expect(randomUUID).toHaveBeenCalledTimes(1);
    });
  });

  describe('static createNil', () => {
    it('should create an ID with nil UUID', () => {
      const id = Id.createNil();
      expect(id.value).toBe(nilUuid);
      expect(id.isNil()).toBe(true);
    });
  });

  describe('static fromString', () => {
    it('should create an ID from a valid UUID string', () => {
      const id = Id.fromString(mockUuid);
      expect(id).not.toBeNull();
      expect(id).toBeInstanceOf(Id);
      expect(id?.value).toBe(mockUuid);
    });

    it('should return null for an invalid UUID string', () => {
      (validations.validId as jest.Mock).mockReturnValueOnce(false);
      const id = Id.fromString('not-a-uuid');
      expect(id).toBeNull();
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
      // @ts-expect-error - Testing runtime type validation
      expect(Id.isValid(123)).toBe(false);
      // @ts-expect-error - Testing runtime type validation
      expect(Id.isValid(null)).toBe(false);
      // @ts-expect-error - Testing runtime type validation
      expect(Id.isValid(undefined)).toBe(false);
    });
  });

  describe('Value Object behavior', () => {
    it('should support identity comparison between instances', () => {
      const id1 = new Id(mockUuid);
      const id2 = new Id(mockUuid);

      // Different objects in memory, but same value
      expect(id1).not.toBe(id2); // Different references
      expect(id1.equals(id2)).toBe(true); // Equal values
    });

    it('should remain immutable', () => {
      const id = new Id(mockUuid);
      expect(Object.isFrozen(id)).toBe(true);
    });
  });

  describe('Real-world scenarios', () => {
    it('should work as a key in Maps', () => {
      const id1 = new Id(mockUuid);
      const id2 = new Id(mockUuid);
      const id3 = new Id('f47ac10b-58cc-4372-a567-0e02b2c3d479');

      const map = new Map();
      map.set(id1.toString(), 'Value 1');

      // Same string value means same key
      expect(map.get(id2.toString())).toBe('Value 1');
      expect(map.get(id3.toString())).toBeUndefined();
    });

    it('should work properly in Sets', () => {
      const id1 = new Id(mockUuid);
      const id2 = new Id(mockUuid);
      const id3 = new Id('f47ac10b-58cc-4372-a567-0e02b2c3d479');

      const set = new Set<string>();
      set.add(id1.toString());

      expect(set.has(id2.toString())).toBe(true);
      expect(set.has(id3.toString())).toBe(false);
    });

    it('should behave well in array operations', () => {
      const id1 = new Id(mockUuid);
      const id2 = new Id('f47ac10b-58cc-4372-a567-0e02b2c3d479');

      const array = [id1.toString(), id2.toString()];

      expect(array.includes(id1.toString())).toBe(true);
      expect(array.indexOf(id1.toString())).toBe(0);
    });
  });
});
