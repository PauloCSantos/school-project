import { FindScheduleOutputDto } from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

type ScheduleMapperProps = FindScheduleOutputDto & {
  id: string;
};
export default class ScheduleMapper {
  static toObj(input: Schedule): ScheduleMapperProps {
    return {
      id: input.id.id,
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
