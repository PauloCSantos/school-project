import { AppError } from '@/modules/@shared/errors/errors';
import { ErrorKindEnum } from '@/modules/@shared/enums/enums';

export class InternalError extends AppError {
  constructor(message: string) {
    let logMessage = message;
    super(ErrorKindEnum.INTERNAL, 'INTERNAL_SERVER', 'Internal server error');
  }
}
