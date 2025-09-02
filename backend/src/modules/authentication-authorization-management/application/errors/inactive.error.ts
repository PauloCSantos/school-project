import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class InactiveTenantError extends AppError {
  constructor(message: string) {
    super(ErrorKindEnum.VALIDATION, 'INACTIVE TENANT', message);
  }
}
