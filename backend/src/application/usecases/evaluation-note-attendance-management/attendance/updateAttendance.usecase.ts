import {
  UpdateAttendanceInputDto,
  UpdateAttendanceOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AttendanceGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/attendance.gateway';

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

    try {
      date !== undefined && (attendance.date = date);
      day !== undefined && (attendance.day = day);
      hour !== undefined && (attendance.hour = hour);
      lesson !== undefined && (attendance.lesson = lesson);

      const result = await this._attendanceRepository.update(attendance);

      return {
        id: result.id.id,
        lesson: result.lesson,
        date: result.date,
        hour: result.hour,
        day: result.day,
      };
    } catch (error) {
      throw error;
    }
  }
}
