import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateAttendanceInputDto,
  CreateAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

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
      attendance.id.value
    );
    if (attendanceVerification) throw new Error('Attendance already exists');

    const result = await this._attendanceRepository.create(attendance);

    return { id: result };
  }
}
