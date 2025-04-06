import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import { FindLessonOutputDto } from '../dto/lesson-usecase.dto';

type LessonMapperProps = FindLessonOutputDto & {
  id: string;
};
export default class LessonMapper {
  static toObj(input: Lesson): LessonMapperProps {
    return {
      id: input.id.id,
      days: input.days,
      duration: input.duration,
      name: input.name,
      semester: input.semester,
      studentsList: input.studentList,
      subject: input.subject,
      teacher: input.teacher,
      times: input.times,
    };
  }
  static toInstance(input: LessonMapperProps): Lesson {
    return new Lesson({
      id: new Id(input.id),
      days: input.days as DayOfWeek[],
      duration: input.duration,
      name: input.name,
      semester: input.semester as 1 | 2,
      studentsList: input.studentsList,
      subject: input.subject,
      teacher: input.teacher,
      times: input.times as Hour[],
    });
  }
}
