import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAttendanceInputDto,
  FindAttendanceOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';

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
        id: response.id.value,
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
