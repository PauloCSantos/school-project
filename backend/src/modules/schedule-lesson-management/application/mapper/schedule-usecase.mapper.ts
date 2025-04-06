import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';
import { FindScheduleOutputDto } from '../dto/schedule-usecase.dto';

type ScheduleMapperProps = FindScheduleOutputDto & {
  id: string;
};
export default class ScheduleMapper {
  static toObj(input: Schedule): ScheduleMapperProps {
    return {
      id: input.id.value,
      curriculum: input.curriculum,
      lessonsList: input.lessonsList,
      student: input.student,
    };
  }
  static toInstance(input: ScheduleMapperProps): Schedule {
    return new Schedule({
      id: new Id(input.id),
      curriculum: input.curriculum,
      lessonsList: input.lessonsList,
      student: input.student,
    });
  }
}
