import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class AuthUserNotFoundError extends AppError {
  constructor(email?: string) {
    super(
      ErrorKindEnum.NOT_FOUND,
      'USER_NOT_FOUND',
      'User not found',
      email ? { email } : undefined
    );
  }
}
