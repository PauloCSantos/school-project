import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class EvaluationNotFoundError extends AppError {
  constructor(id?: string) {
    super(
      ErrorKindEnum.NOT_FOUND,
      'EVALUATION_NOT_FOUND',
      'Evaluation not found',
      id ? { id } : undefined
    );
  }
}
