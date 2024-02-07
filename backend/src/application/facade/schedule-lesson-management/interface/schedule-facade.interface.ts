import {
  AddLessonsInputDto,
  AddLessonsOutputDto,
  CreateScheduleInputDto,
  CreateScheduleOutputDto,
  DeleteScheduleInputDto,
  DeleteScheduleOutputDto,
  FindAllScheduleInputDto,
  FindAllScheduleOutputDto,
  FindScheduleInputDto,
  FindScheduleOutputDto,
  RemoveLessonsInputDto,
  RemoveLessonsOutputDto,
  UpdateScheduleInputDto,
  UpdateScheduleOutputDto,
} from '@/application/dto/schedule-lesson-management/schedule-facade.dto';

export default interface ScheduleFacadeInterface {
  create(input: CreateScheduleInputDto): Promise<CreateScheduleOutputDto>;
  find(input: FindScheduleInputDto): Promise<FindScheduleOutputDto | undefined>;
  findAll(input: FindAllScheduleInputDto): Promise<FindAllScheduleOutputDto>;
  delete(input: DeleteScheduleInputDto): Promise<DeleteScheduleOutputDto>;
  update(input: UpdateScheduleInputDto): Promise<UpdateScheduleOutputDto>;
  addLessons(input: AddLessonsInputDto): Promise<AddLessonsOutputDto>;
  removeLessons(input: RemoveLessonsInputDto): Promise<RemoveLessonsOutputDto>;
}
