import AddLessons from '../../usecases/schedule/add-lessons.usecase';
import CreateSchedule from '../../usecases/schedule/create.usecase';
import DeleteSchedule from '../../usecases/schedule/delete.usecase';
import FindAllSchedule from '../../usecases/schedule/find-all.usecase';
import FindSchedule from '../../usecases/schedule/find.usecase';
import RemoveLessons from '../../usecases/schedule/remove-lessons.usecase';
import UpdateSchedule from '../../usecases/schedule/update.usecase';
import ScheduleFacadeInterface from '../interface/schedule.interface';
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
} from '../../dto/schedule-facade.dto';

type ScheduleFacadeProps = {
  createSchedule: CreateSchedule;
  deleteSchedule: DeleteSchedule;
  findAllSchedule: FindAllSchedule;
  findSchedule: FindSchedule;
  updateSchedule: UpdateSchedule;
  addLessons: AddLessons;
  removeLessons: RemoveLessons;
};
export default class ScheduleFacade implements ScheduleFacadeInterface {
  private _createSchedule: CreateSchedule;
  private _deleteSchedule: DeleteSchedule;
  private _findAllSchedule: FindAllSchedule;
  private _findSchedule: FindSchedule;
  private _updateSchedule: UpdateSchedule;
  private _addLessons: AddLessons;
  private _removeLessons: RemoveLessons;

  constructor(input: ScheduleFacadeProps) {
    this._createSchedule = input.createSchedule;
    this._deleteSchedule = input.deleteSchedule;
    this._findAllSchedule = input.findAllSchedule;
    this._findSchedule = input.findSchedule;
    this._updateSchedule = input.updateSchedule;
    this._addLessons = input.addLessons;
    this._removeLessons = input.removeLessons;
  }

  async create(
    input: CreateScheduleInputDto
  ): Promise<CreateScheduleOutputDto> {
    return await this._createSchedule.execute(input);
  }
  async find(
    input: FindScheduleInputDto
  ): Promise<FindScheduleOutputDto | undefined> {
    return await this._findSchedule.execute(input);
  }
  async findAll(
    input: FindAllScheduleInputDto
  ): Promise<FindAllScheduleOutputDto> {
    return await this._findAllSchedule.execute(input);
  }
  async delete(
    input: DeleteScheduleInputDto
  ): Promise<DeleteScheduleOutputDto> {
    return await this._deleteSchedule.execute(input);
  }
  async update(
    input: UpdateScheduleInputDto
  ): Promise<UpdateScheduleOutputDto> {
    return await this._updateSchedule.execute(input);
  }
  async addLessons(input: AddLessonsInputDto): Promise<AddLessonsOutputDto> {
    return await this._addLessons.execute(input);
  }
  async removeLessons(
    input: RemoveLessonsInputDto
  ): Promise<RemoveLessonsOutputDto> {
    return await this._removeLessons.execute(input);
  }
}
