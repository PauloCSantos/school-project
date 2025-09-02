import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class RoleNotFoundError extends AppError {
  constructor(message: string) {
    super(ErrorKindEnum.NOT_FOUND, 'ROLE_NOT_FOUND', message);
  }
}
