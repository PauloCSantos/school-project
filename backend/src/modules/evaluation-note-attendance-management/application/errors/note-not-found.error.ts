import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class NoteNotFoundError extends AppError {
  constructor(id?: string) {
    super(
      ErrorKindEnum.NOT_FOUND,
      'NOTE_NOT_FOUND',
      'Note not found',
      id ? { id } : undefined
    );
  }
}
