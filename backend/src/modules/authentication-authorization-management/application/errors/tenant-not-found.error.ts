import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class TenantNotFoundError extends AppError {
  constructor() {
    super(ErrorKindEnum.NOT_FOUND, 'TENANT_NOT_FOUND', 'Tenant not found');
  }
}
