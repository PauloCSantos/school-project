import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class SubjectNotFoundError extends AppError {
  constructor(id?: string) {
    super(
      ErrorKindEnum.NOT_FOUND,
      'SUBJECT_NOT_FOUND',
      'Subject not found',
      id ? { id } : undefined
    );
  }
}
