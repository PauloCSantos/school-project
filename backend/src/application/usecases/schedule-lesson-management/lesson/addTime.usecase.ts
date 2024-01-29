import {
  AddTimeInputDto,
  AddTimeOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/infraestructure/gateway/schedule-lesson-management/lesson.gateway';

export default class AddTime
  implements UseCaseInterface<AddTimeInputDto, AddTimeOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({
    id,
    newTimesList,
  }: AddTimeInputDto): Promise<AddTimeOutputDto> {
    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');

    try {
      newTimesList.forEach(time => {
        lessonVerification.addTime(time as Hour);
      });
      const result = await this._lessonRepository.addTime(id, newTimesList);

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
