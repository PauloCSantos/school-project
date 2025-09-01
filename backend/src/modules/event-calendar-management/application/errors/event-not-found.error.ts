import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class EventNotFoundError extends AppError {
  constructor(id?: string) {
    super(
      ErrorKindEnum.NOT_FOUND,
      'EVENT_NOT_FOUND',
      'Event not found',
      id ? { id } : undefined
    );
  }
}
