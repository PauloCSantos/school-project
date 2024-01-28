import {
  CreateAttendanceInputDto,
  CreateAttendanceOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/attendance/gateway/attendance.gateway';
import Attendance from '@/modules/evaluation-note-attendance-management/attendance/domain/entity/attendance.entity';

export default class CreateAttendance
  implements
    UseCaseInterface<CreateAttendanceInputDto, CreateAttendanceOutputDto>
{
  private _attendanceRepository: AttendanceGateway;

  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }
  async execute({
    date,
    day,
    hour,
    lesson,
    studentsPresent,
  }: CreateAttendanceInputDto): Promise<CreateAttendanceOutputDto> {
    const attendance = new Attendance({
      date,
      day,
      hour,
      lesson,
      studentsPresent,
    });

    const attendanceVerification = await this._attendanceRepository.find(
      attendance.id.id
    );
    if (attendanceVerification) throw new Error('Attendance already exists');

    const result = await this._attendanceRepository.create(attendance);

    return { id: result };
  }
}
