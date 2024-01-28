import {
  FindAllAttendanceInputDto,
  FindAllAttendanceOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/attendance/gateway/attendance.gateway';

export default class FindAllAttendance
  implements
    UseCaseInterface<FindAllAttendanceInputDto, FindAllAttendanceOutputDto>
{
  private _attendanceRepository: AttendanceGateway;

  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllAttendanceInputDto): Promise<FindAllAttendanceOutputDto> {
    const results = await this._attendanceRepository.findAll(offset, quantity);

    const result = results.map(attendance => ({
      lesson: attendance.lesson,
      date: attendance.date,
      hour: attendance.hour,
      day: attendance.day,
      studentsPresent: attendance.studentsPresent,
    }));

    return result;
  }
}
