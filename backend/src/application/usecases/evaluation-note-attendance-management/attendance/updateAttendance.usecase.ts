import {
  UpdateAttendanceInputDto,
  UpdateAttendanceOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/attendance/gateway/attendance.gateway';

export default class UpdateAttendance
  implements
    UseCaseInterface<UpdateAttendanceInputDto, UpdateAttendanceOutputDto>
{
  private _attendanceRepository: AttendanceGateway;

  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }
  async execute({
    id,
    date,
    day,
    hour,
    lesson,
  }: UpdateAttendanceInputDto): Promise<UpdateAttendanceOutputDto> {
    const attendance = await this._attendanceRepository.find(id);
    if (!attendance) throw new Error('Attendance not found');

    date && (attendance.date = date);
    day && (attendance.day = day);
    hour && (attendance.hour = hour);
    lesson && (attendance.lesson = lesson);

    const result = await this._attendanceRepository.update(attendance);

    return {
      lesson: result.lesson,
      date: result.date,
      hour: result.hour,
      day: result.day,
    };
  }
}