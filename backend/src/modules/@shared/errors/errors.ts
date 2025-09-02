import { ErrorKind } from '../type/sharedTypes';

export class AppError extends Error {
  constructor(
    readonly kind: ErrorKind,
    readonly code: string,
    readonly message: string,
    readonly details?: unknown
  ) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const isAppError = (e: unknown): e is AppError => e instanceof AppError;
