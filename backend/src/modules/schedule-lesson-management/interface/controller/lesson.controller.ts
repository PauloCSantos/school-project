import {
  CreateLessonInputDto,
  AddDayInputDto,
  AddDayOutputDto,
  AddStudentsInputDto,
  AddStudentsOutputDto,
  AddTimeInputDto,
  AddTimeOutputDto,
  CreateLessonOutputDto,
  DeleteLessonInputDto,
  DeleteLessonOutputDto,
  FindAllLessonInputDto,
  FindAllLessonOutputDto,
  FindLessonInputDto,
  FindLessonOutputDto,
  RemoveDayInputDto,
  RemoveDayOutputDto,
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
  RemoveTimeInputDto,
  RemoveTimeOutputDto,
  UpdateLessonInputDto,
  UpdateLessonOutputDto,
} from '../../application/dto/lesson-usecase.dto';
import AddDay from '../../application/usecases/lesson/add-day.usecase';
import AddStudents from '../../application/usecases/lesson/add-students.usecase';
import AddTime from '../../application/usecases/lesson/add-time.usecase';
import CreateLesson from '../../application/usecases/lesson/create.usecase';
import DeleteLesson from '../../application/usecases/lesson/delete.usecase';
import FindAllLesson from '../../application/usecases/lesson/find-all.usecase';
import FindLesson from '../../application/usecases/lesson/find.usecase';
import RemoveDay from '../../application/usecases/lesson/remove-day.usecase';
import RemoveStudents from '../../application/usecases/lesson/remove-students.usecase';
import RemoveTime from '../../application/usecases/lesson/remove-time.usecase';
import UpdateLesson from '../../application/usecases/lesson/update.usecase';

export class LessonController {
  constructor(
    private readonly createLesson: CreateLesson,
    private readonly findLesson: FindLesson,
    private readonly findAllLesson: FindAllLesson,
    private readonly updateLesson: UpdateLesson,
    private readonly deleteLesson: DeleteLesson,
    private readonly addStudentstoLesson: AddStudents,
    private readonly removeStudentstoLesson: RemoveStudents,
    private readonly addDaytoLesson: AddDay,
    private readonly removeDaytoLesson: RemoveDay,
    private readonly addTimetoLesson: AddTime,
    private readonly removeTimetoLesson: RemoveTime
  ) {}

  async create(input: CreateLessonInputDto): Promise<CreateLessonOutputDto> {
    const response = await this.createLesson.execute(input);
    return response;
  }
  async find(
    input: FindLessonInputDto
  ): Promise<FindLessonOutputDto | undefined> {
    const response = await this.findLesson.execute(input);
    return response;
  }
  async findAll(input: FindAllLessonInputDto): Promise<FindAllLessonOutputDto> {
    const response = await this.findAllLesson.execute(input);
    return response;
  }
  async delete(input: DeleteLessonInputDto): Promise<DeleteLessonOutputDto> {
    const response = await this.deleteLesson.execute(input);
    return response;
  }
  async update(input: UpdateLessonInputDto): Promise<UpdateLessonOutputDto> {
    const response = await this.updateLesson.execute(input);
    return response;
  }
  async addStudents(input: AddStudentsInputDto): Promise<AddStudentsOutputDto> {
    const response = await this.addStudentstoLesson.execute(input);
    return response;
  }
  async removeStudents(
    input: RemoveStudentsInputDto
  ): Promise<RemoveStudentsOutputDto> {
    const response = await this.removeStudentstoLesson.execute(input);
    return response;
  }
  async addTime(input: AddTimeInputDto): Promise<AddTimeOutputDto> {
    const response = await this.addTimetoLesson.execute(input);
    return response;
  }
  async removeTime(input: RemoveTimeInputDto): Promise<RemoveTimeOutputDto> {
    const response = await this.removeTimetoLesson.execute(input);
    return response;
  }
  async addDay(input: AddDayInputDto): Promise<AddDayOutputDto> {
    const response = await this.addDaytoLesson.execute(input);
    return response;
  }
  async removeDay(input: RemoveDayInputDto): Promise<RemoveDayOutputDto> {
    const response = await this.removeDaytoLesson.execute(input);
    return response;
  }
}
