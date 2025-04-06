import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import {
  AddLessonsInputDto,
  AddLessonsOutputDto,
} from '../../dto/schedule-usecase.dto';
import ScheduleGateway from '@/modules/schedule-lesson-management/infrastructure/gateway/schedule.gateway';
import ScheduleMapper from '../../mapper/schedule-usecase.mapper';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

export default class AddLessons
  implements UseCaseInterface<AddLessonsInputDto, AddLessonsOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  async execute({
    id,
    newLessonsList,
  }: AddLessonsInputDto): Promise<AddLessonsOutputDto> {
    const scheduleVerification = await this._scheduleRepository.find(id);
    if (!scheduleVerification) throw new Error('Schedule not found');
    const scheduleObj = ScheduleMapper.toObj(scheduleVerification);
    const newSchedule = JSON.parse(JSON.stringify(scheduleObj));
    const schedule = new Schedule({
      ...newSchedule,
      id: new Id(newSchedule.id),
    });
    try {
      newLessonsList.forEach(lessonId => {
        schedule.addLesson(lessonId);
      });
      const result = await this._scheduleRepository.addLessons(
        id,
        newLessonsList
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
