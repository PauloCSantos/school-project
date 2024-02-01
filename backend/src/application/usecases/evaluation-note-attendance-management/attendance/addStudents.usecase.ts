import {
  AddStudentsInputDto,
  AddStudentsOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import AttendanceGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/attendance.gateway';
import AttendanceMapper from '@/application/mapper/evaluation-note-attendance-management/attendance-usecase.mapper';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

export default class AddStudents
  implements UseCaseInterface<AddStudentsInputDto, AddStudentsOutputDto>
{
  private _attendanceRepository: AttendanceGateway;

  constructor(attendanceRepository: AttendanceGateway) {
    this._attendanceRepository = attendanceRepository;
  }
  async execute({
    id,
    newStudentsList,
  }: AddStudentsInputDto): Promise<AddStudentsOutputDto> {
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
      newStudentsList.forEach(studentId => {
        attendance.addStudent(studentId);
      });
      const result = await this._attendanceRepository.addStudent(
        id,
        newStudentsList
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
