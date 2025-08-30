import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class MapperError extends AppError {
  constructor(message: string) {
    super(ErrorKindEnum.INTEGRATION, 'INVALID_MAPPER', message);
  }
}
