import {
  DeleteAttendanceInputDto,
  DeleteAttendanceOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/attendance/gateway/attendance.gateway';

export default class DeleteAttendance
  implements
    UseCaseInterface<DeleteAttendanceInputDto, DeleteAttendanceOutputDto>
{
  private _attendanceRepository: AttendanceGateway;

  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }
  async execute({
    id,
  }: DeleteAttendanceInputDto): Promise<DeleteAttendanceOutputDto> {
    const attendanceVerification = await this._attendanceRepository.find(id);
    if (!attendanceVerification) throw new Error('Attendance not found');

    const result = await this._attendanceRepository.delete(id);

    return { message: result };
  }
}
