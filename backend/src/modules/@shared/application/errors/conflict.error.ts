import { AppError } from '@/modules/@shared/errors/errors';
import { ErrorKindEnum } from '@/modules/@shared/enums/enums';

export class ConflictError extends AppError {
  constructor(message: string) {
    super(ErrorKindEnum.CONFLICT, 'CONFLICT', message);
  }
}
