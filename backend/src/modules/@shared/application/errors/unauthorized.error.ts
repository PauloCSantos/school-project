import { AppError } from '@/modules/@shared/errors/errors';
import { ErrorKindEnum } from '@/modules/@shared/enums/enums';

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(ErrorKindEnum.UNAUTHORIZED, 'UNAUTHORIZED', message);
  }
}
