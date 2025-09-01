import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class CurriculumNotFoundError extends AppError {
  constructor(id?: string) {
    super(
      ErrorKindEnum.NOT_FOUND,
      'CURRICULUM_NOT_FOUND',
      'Curriculum not found',
      id ? { id } : undefined
    );
  }
}
