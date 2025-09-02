import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class InvalidCredentialsError extends AppError {
  constructor() {
    super(
      ErrorKindEnum.UNAUTHORIZED,
      'INVALID_CREDENTIALS',
      'Invalid credentials. Please check your email and password and try again'
    );
  }
}
