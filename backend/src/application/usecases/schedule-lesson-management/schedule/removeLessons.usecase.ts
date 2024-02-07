import {
  RemoveLessonsInputDto,
  RemoveLessonsOutputDto,
} from '@/application/dto/schedule-lesson-management/schedule-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import ScheduleGateway from '@/infraestructure/gateway/schedule-lesson-management/schedule.gateway';
import ScheduleMapper from '@/application/mapper/schedule-lesson-management/schedule-usecase.mapper';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

export default class RemoveLessons
  implements UseCaseInterface<RemoveLessonsInputDto, RemoveLessonsOutputDto>
{
  private _scheduleRepository: ScheduleGateway;

  constructor(scheduleRepository: ScheduleGateway) {
    this._scheduleRepository = scheduleRepository;
  }
  async execute({
    id,
    lessonsListToRemove,
  }: RemoveLessonsInputDto): Promise<RemoveLessonsOutputDto> {
    const scheduleVerification = await this._scheduleRepository.find(id);
    if (!scheduleVerification) throw new Error('Schedule not found');
    const scheduleObj = ScheduleMapper.toObj(scheduleVerification);
    const newSchedule = JSON.parse(JSON.stringify(scheduleObj));
    const schedule = new Schedule({
      ...newSchedule,
      id: new Id(newSchedule.id),
    });
    try {
      lessonsListToRemove.forEach(lessonId => {
        schedule.removeLesson(lessonId);
      });
      const result = await this._scheduleRepository.removeLessons(
        id,
        lessonsListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
