import { validId } from '../../utils/validations';
import { randomUUID } from 'crypto';

/**
 * Custom error for ID validation failures
 */
export class InvalidIdError extends Error {
  constructor(message: string = 'Invalid ID format') {
    super(message);
    this.name = 'InvalidIdError';
    // Preserves stack trace in modern JS engines
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

    // Ensure immutability
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
   * Returns a string representation of this ID
   * @returns The ID value as a string
   */
  toString(): string {
    return this._value;
  }

  /**
   * Converts this ID to a primitive value for JSON serialization
   * @returns The ID value as a string
   */
  toJSON(): string {
    return this._value;
  }

  /**
   * Computes a hash code for this ID
   * Simple implementation that can be improved if needed
   * @returns A numeric hash code
   */
  hashCode(): number {
    let hash = 0;
    for (let i = 0; i < this._value.length; i++) {
      const char = this._value.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Checks if this ID is the nil/empty UUID
   * @returns true if this ID is the nil UUID (all zeros)
   */
  isNil(): boolean {
    return this._value === '00000000-0000-0000-0000-000000000000';
  }

  /**
   * Creates a new ID instance
   * @returns A new ID with a randomly generated UUID
   */
  static create(): Id {
    return new Id();
  }

  /**
   * Creates the nil/empty UUID
   * @returns An ID with the nil UUID value
   */
  static createNil(): Id {
    return new Id('00000000-0000-0000-0000-000000000000');
  }

  /**
   * Attempts to create an ID from a string value
   * @param id - The string to convert to an ID
   * @returns An ID instance if conversion was successful, null otherwise
   */
  static fromString(id: string): Id | null {
    try {
      return new Id(id);
    } catch (error) {
      return null;
    }
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
