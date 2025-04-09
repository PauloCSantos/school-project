import {
  CreateScheduleInputDto,
  AddLessonsInputDto,
  AddLessonsOutputDto,
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
} from '../../application/dto/schedule-usecase.dto';
import AddLessons from '../../application/usecases/schedule/add-lessons.usecase';
import CreateSchedule from '../../application/usecases/schedule/create.usecase';
import DeleteSchedule from '../../application/usecases/schedule/delete.usecase';
import FindAllSchedule from '../../application/usecases/schedule/find-all.usecase';
import FindSchedule from '../../application/usecases/schedule/find.usecase';
import RemoveLessons from '../../application/usecases/schedule/remove-lessons.usecase';
import UpdateSchedule from '../../application/usecases/schedule/update.usecase';

export class ScheduleController {
  constructor(
    private readonly createSchedule: CreateSchedule,
    private readonly findSchedule: FindSchedule,
    private readonly findAllSchedule: FindAllSchedule,
    private readonly updateSchedule: UpdateSchedule,
    private readonly deleteSchedule: DeleteSchedule,
    private readonly addLessonstoSchedule: AddLessons,
    private readonly removeLessonstoSchedule: RemoveLessons
  ) {}

  async create(
    input: CreateScheduleInputDto
  ): Promise<CreateScheduleOutputDto> {
    const response = await this.createSchedule.execute(input);
    return response;
  }
  async find(
    input: FindScheduleInputDto
  ): Promise<FindScheduleOutputDto | undefined> {
    const response = await this.findSchedule.execute(input);
    return response;
  }
  async findAll(
    input: FindAllScheduleInputDto
  ): Promise<FindAllScheduleOutputDto> {
    const response = await this.findAllSchedule.execute(input);
    return response;
  }
  async delete(
    input: DeleteScheduleInputDto
  ): Promise<DeleteScheduleOutputDto> {
    const response = await this.deleteSchedule.execute(input);
    return response;
  }
  async update(
    input: UpdateScheduleInputDto
  ): Promise<UpdateScheduleOutputDto> {
    const response = await this.updateSchedule.execute(input);
    return response;
  }
  async addLessons(input: AddLessonsInputDto): Promise<AddLessonsOutputDto> {
    const response = await this.addLessonstoSchedule.execute(input);
    return response;
  }
  async removeLessons(
    input: RemoveLessonsInputDto
  ): Promise<RemoveLessonsOutputDto> {
    const response = await this.removeLessonstoSchedule.execute(input);
    return response;
  }
}
