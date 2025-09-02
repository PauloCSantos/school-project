import { AppError } from '@/modules/@shared/errors/errors';
import { ErrorKindEnum } from '@/modules/@shared/enums/enums';

export class AcessDeniedError extends AppError {
  constructor(message: string) {
    super(ErrorKindEnum.FORBIDDEN, 'FORBIDDEN', message);
  }
}
