import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class ScheduleNotFoundError extends AppError {
  constructor(id?: string) {
    super(
      ErrorKindEnum.NOT_FOUND,
      'SCHEDULE_NOT_FOUND',
      'Schedule not found',
      id ? { id } : undefined
    );
  }
}
