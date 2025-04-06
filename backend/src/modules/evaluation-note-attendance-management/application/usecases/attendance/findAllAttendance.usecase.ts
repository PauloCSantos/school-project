import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllAttendanceInputDto,
  FindAllAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';

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
      id: attendance.id.id,
      lesson: attendance.lesson,
      date: attendance.date,
      hour: attendance.hour,
      day: attendance.day,
      studentsPresent: attendance.studentsPresent,
    }));

    return result;
  }
}
