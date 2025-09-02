import { AppError } from '@/modules/@shared/errors/errors';
import { ErrorKindEnum } from '@/modules/@shared/enums/enums';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(ErrorKindEnum.VALIDATION, 'VALIDATION', message);
  }
}
