import {
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/attendance/gateway/attendance.gateway';

export default class RemoveStudents
  implements UseCaseInterface<RemoveStudentsInputDto, RemoveStudentsOutputDto>
{
  private _attendanceRepository: AttendanceGateway;

  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }
  async execute({
    id,
    studentsListToRemove,
  }: RemoveStudentsInputDto): Promise<RemoveStudentsOutputDto> {
    const attendanceVerification = await this._attendanceRepository.find(id);
    if (!attendanceVerification) throw new Error('Attendance not found');

    try {
      studentsListToRemove.forEach(studentId => {
        attendanceVerification.removeStudent(studentId);
      });
      const result = await this._attendanceRepository.removeStudent(
        id,
        studentsListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
