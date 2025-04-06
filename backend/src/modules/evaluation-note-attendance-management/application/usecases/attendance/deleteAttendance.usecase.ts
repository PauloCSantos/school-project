import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteAttendanceInputDto,
  DeleteAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';

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
