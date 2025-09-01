import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class LessonNotFoundError extends AppError {
  constructor(id?: string) {
    super(
      ErrorKindEnum.NOT_FOUND,
      'LESSON_NOT_FOUND',
      'Lesson not found',
      id ? { id } : undefined
    );
  }
}
