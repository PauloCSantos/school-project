import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateAttendanceInputDto,
  UpdateAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';

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
        id: result.id.value,
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
