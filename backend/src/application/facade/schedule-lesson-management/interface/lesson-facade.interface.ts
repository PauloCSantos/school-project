import {
  CreateLessonInputDto,
  CreateLessonOutputDto,
  AddDayInputDto,
  AddDayOutputDto,
  AddStudentsInputDto,
  AddStudentsOutputDto,
  AddTimeInputDto,
  AddTimeOutputDto,
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
} from '@/application/dto/schedule-lesson-management/lesson-facade.dto';

export default interface LessonFacadeInterface {
  create(input: CreateLessonInputDto): Promise<CreateLessonOutputDto>;
  find(input: FindLessonInputDto): Promise<FindLessonOutputDto | undefined>;
  findAll(input: FindAllLessonInputDto): Promise<FindAllLessonOutputDto>;
  delete(input: DeleteLessonInputDto): Promise<DeleteLessonOutputDto>;
  update(input: UpdateLessonInputDto): Promise<UpdateLessonOutputDto>;
  addStudents(input: AddStudentsInputDto): Promise<AddStudentsOutputDto>;
  removeStudents(
    input: RemoveStudentsInputDto
  ): Promise<RemoveStudentsOutputDto>;
  addDay(input: AddDayInputDto): Promise<AddDayOutputDto>;
  removeDay(input: RemoveDayInputDto): Promise<RemoveDayOutputDto>;
  addTime(input: AddTimeInputDto): Promise<AddTimeOutputDto>;
  removeTime(input: RemoveTimeInputDto): Promise<RemoveTimeOutputDto>;
}
