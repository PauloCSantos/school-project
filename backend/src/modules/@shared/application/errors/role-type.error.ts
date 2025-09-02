import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';
import { ALL_ROLES } from '../../consts/consts';

export class RoleTypeError extends AppError {
  constructor(role: string) {
    super(ErrorKindEnum.VALIDATION, 'ROLE_TYPE', 'Invalid role', {
      field: 'role',
      received: role,
      allowed: ALL_ROLES,
    });
  }
}
