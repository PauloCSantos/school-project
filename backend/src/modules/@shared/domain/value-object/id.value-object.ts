import { validId } from '../../utils/validations';
import { randomUUID } from 'crypto';

/**
 * Custom error for ID validation failures
 */
export class InvalidIdError extends Error {
  constructor(message: string = 'Invalid ID format') {
    super(message);
    this.name = 'InvalidIdError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidIdError);
    }
  }
}

/**
 * @class Id
 * @description Value Object representing a unique identifier, implemented as UUID v4
 * Follows the principles of Domain-Driven Design for Value Objects:
 * - Immutability: Once created, an ID cannot be changed
 * - Value equality: IDs with the same value are considered equal
 * - Self-validation: IDs validate themselves upon creation
 *
 * @example
 * // Create a new random ID
 * const id1 = Id.create();
 *
 * // Create from an existing UUID string
 * const id2 = new Id('123e4567-e89b-12d3-a456-426614174000');
 *
 * // Safe creation (no exceptions)
 * const id3 = Id.fromString('invalid-id'); // Returns null if invalid
 */
export default class Id {
  private readonly _value: string;

  /**
   * Creates a new Id instance
   * @param id - Optional UUID string. If not provided, a new UUID v4 will be generated
   * @throws {InvalidIdError} If the provided id is not a valid UUID
   */
  constructor(id?: string) {
    if (id !== undefined) {
      if (typeof id !== 'string') {
        throw new InvalidIdError('ID must be a string');
      }
      this.validate(id);
      this._value = id;
    } else {
      this._value = randomUUID();
    }

    Object.freeze(this);
  }

  /**
   * Gets the string value of the ID
   */
  get value(): string {
    return this._value;
  }

  /**
   * Validates if a string is a valid UUID
   * @param id - The string to validate
   * @throws {InvalidIdError} If the string is not a valid UUID
   */
  private validate(id: string): void {
    if (!validId(id)) {
      throw new InvalidIdError('ID must be a valid UUID');
    }
  }

  /**
   * Checks if this ID equals another ID
   * @param other - Another ID to compare with
   * @returns true if both IDs have the same value
   */
  equals(other: unknown): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (!(other instanceof Id)) {
      return false;
    }

    return this._value === other.value;
  }

  /**
   * Creates a new ID instance
   * @returns A new ID with a randomly generated UUID
   */
  static create(): Id {
    return new Id();
  }

  /**
   * Checks if a string is a valid UUID without throwing exceptions
   * @param id - The string to validate
   * @returns true if the string is a valid UUID
   */
  static isValid(id: string): boolean {
    return typeof id === 'string' && validId(id);
  }
}
