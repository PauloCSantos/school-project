import {
  FindAttendanceInputDto,
  FindAttendanceOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AttendanceGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/attendance.gateway';

export default class FindAttendance
  implements
    UseCaseInterface<
      FindAttendanceInputDto,
      FindAttendanceOutputDto | undefined
    >
{
  private _attendanceRepository: AttendanceGateway;

  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }
  async execute({
    id,
  }: FindAttendanceInputDto): Promise<FindAttendanceOutputDto | undefined> {
    const response = await this._attendanceRepository.find(id);
    if (response) {
      return {
        lesson: response.lesson,
        date: response.date,
        hour: response.hour,
        day: response.day,
        studentsPresent: response.studentsPresent,
      };
    } else {
      return response;
    }
  }
}
