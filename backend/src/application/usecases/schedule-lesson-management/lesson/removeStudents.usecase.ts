import {
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
} from '@/application/dto/schedule-lesson-management/lesson-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import LessonGateway from '@/infraestructure/gateway/schedule-lesson-management/lesson.gateway';

export default class RemoveStudents
  implements UseCaseInterface<RemoveStudentsInputDto, RemoveStudentsOutputDto>
{
  private _lessonRepository: LessonGateway;

  constructor(lessonRepository: LessonGateway) {
    this._lessonRepository = lessonRepository;
  }
  async execute({
    id,
    studentsListToRemove,
  }: RemoveStudentsInputDto): Promise<RemoveStudentsOutputDto> {
    const lessonVerification = await this._lessonRepository.find(id);
    if (!lessonVerification) throw new Error('Lesson not found');

    try {
      studentsListToRemove.forEach(studentId => {
        lessonVerification.removeStudent(studentId);
      });
      const result = await this._lessonRepository.removeStudents(
        id,
        studentsListToRemove
      );

      return { message: result };
    } catch (error) {
      throw error;
    }
  }
}
