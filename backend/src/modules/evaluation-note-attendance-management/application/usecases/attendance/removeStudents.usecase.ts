import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
} from '../../dto/attendance-usecase.dto';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';
import AttendanceMapper from '../../mapper/attendance-usecase.mapper';

export default class RemoveStudents
  implements UseCaseInterface<RemoveStudentsInputDto, RemoveStudentsOutputDto>
{
  private _attendanceRepository: AttendanceGateway;

  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }
  async execute({
    id,
    studentsListToRemove,
  }: RemoveStudentsInputDto): Promise<RemoveStudentsOutputDto> {
    const attendanceVerification = await this._attendanceRepository.find(id);
    if (!attendanceVerification) throw new Error('Attendance not found');
    const attendanceObj = AttendanceMapper.toObj(attendanceVerification);
    const newAttendance = JSON.parse(JSON.stringify(attendanceObj));
    const attendance = new Attendance({
      ...newAttendance,
      id: new Id(newAttendance.id),
      date: new Date(newAttendance.date),
      hour: newAttendance.hour as Hour,
      day: newAttendance.day as DayOfWeek,
    });
    try {
      studentsListToRemove.forEach(studentId => {
        attendance.removeStudent(studentId);
      });
      const result = await this._attendanceRepository.removeStudent(
        id,
        studentsListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
