import { ErrorKindEnum } from '@/modules/@shared/enums/enums';
import { AppError } from '@/modules/@shared/errors/errors';

export class AttendanceNotFoundError extends AppError {
  constructor(id?: string) {
    super(
      ErrorKindEnum.NOT_FOUND,
      'ATTENDANCE_NOT_FOUND',
      'Attendance not found',
      id ? { id } : undefined
    );
  }
}
