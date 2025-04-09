import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import { FindAttendanceOutputDto } from '../dto/attendance-usecase.dto';

type AttendanceMapperProps = FindAttendanceOutputDto & {
  id: string;
};
export default class AttendanceMapper {
  static toObj(input: Attendance): AttendanceMapperProps {
    return {
      id: input.id.value,
      date: input.date,
      day: input.day,
      hour: input.hour,
      lesson: input.lesson,
      studentsPresent: input.studentsPresent,
    };
  }
  static toInstance(input: AttendanceMapperProps): Attendance {
    return new Attendance({
      id: new Id(input.id),
      date: input.date,
      day: input.day as DayOfWeek,
      hour: input.hour as Hour,
      lesson: input.lesson,
      studentsPresent: input.studentsPresent,
    });
  }
}
