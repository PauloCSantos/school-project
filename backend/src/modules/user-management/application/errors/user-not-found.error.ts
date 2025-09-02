import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class UserNotFoundError extends AppError {
  constructor(role: string, userId?: string) {
    super(ErrorKindEnum.NOT_FOUND, 'USER_NOT_FOUND', 'User not found', {
      role: role,
      id: userId,
    });
  }
}
