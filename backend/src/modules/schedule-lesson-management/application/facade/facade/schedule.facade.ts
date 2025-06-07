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

/**
 * Properties required to initialize the ScheduleFacade
 */
type ScheduleFacadeProps = {
  readonly createSchedule: CreateSchedule;
  readonly deleteSchedule: DeleteSchedule;
  readonly findAllSchedule: FindAllSchedule;
  readonly findSchedule: FindSchedule;
  readonly updateSchedule: UpdateSchedule;
  readonly addLessons: AddLessons;
  readonly removeLessons: RemoveLessons;
};

/**
 * Facade implementation for schedule operations
 *
 * This class provides a unified interface to the underlying schedule
 * use cases, simplifying client interaction with the schedule subsystem.
 */
export default class ScheduleFacade implements ScheduleFacadeInterface {
  private readonly _createSchedule: CreateSchedule;
  private readonly _deleteSchedule: DeleteSchedule;
  private readonly _findAllSchedule: FindAllSchedule;
  private readonly _findSchedule: FindSchedule;
  private readonly _updateSchedule: UpdateSchedule;
  private readonly _addLessons: AddLessons;
  private readonly _removeLessons: RemoveLessons;

  /**
   * Creates a new instance of ScheduleFacade
   * @param input Dependencies required by the facade
   */
  constructor(input: ScheduleFacadeProps) {
    this._createSchedule = input.createSchedule;
    this._deleteSchedule = input.deleteSchedule;
    this._findAllSchedule = input.findAllSchedule;
    this._findSchedule = input.findSchedule;
    this._updateSchedule = input.updateSchedule;
    this._addLessons = input.addLessons;
    this._removeLessons = input.removeLessons;
  }

  /**
   * Creates a new schedule
   * @param input Schedule creation parameters
   * @returns Information about the created schedule
   */
  public async create(
    input: CreateScheduleInputDto
  ): Promise<CreateScheduleOutputDto> {
    return await this._createSchedule.execute(input);
  }

  /**
   * Finds a schedule by ID
   * @param input Search parameters
   * @returns Schedule information if found, null otherwise
   */
  public async find(
    input: FindScheduleInputDto
  ): Promise<FindScheduleOutputDto | null> {
    const result = await this._findSchedule.execute(input);
    return result || null;
  }

  /**
   * Retrieves all schedules with optional filtering
   * @param input Search parameters for filtering schedules
   * @returns Collection of schedules matching criteria
   */
  public async findAll(
    input: FindAllScheduleInputDto
  ): Promise<FindAllScheduleOutputDto> {
    return await this._findAllSchedule.execute(input);
  }

  /**
   * Deletes a schedule
   * @param input Schedule identification
   * @returns Confirmation message
   */
  public async delete(
    input: DeleteScheduleInputDto
  ): Promise<DeleteScheduleOutputDto> {
    return await this._deleteSchedule.execute(input);
  }

  /**
   * Updates a schedule's information
   * @param input Schedule identification and data to update
   * @returns Updated schedule information
   */
  public async update(
    input: UpdateScheduleInputDto
  ): Promise<UpdateScheduleOutputDto> {
    return await this._updateSchedule.execute(input);
  }

  /**
   * Adds lessons to a schedule
   * @param input Schedule ID and lesson IDs to add
   * @returns Updated schedule information
   */
  public async addLessons(
    input: AddLessonsInputDto
  ): Promise<AddLessonsOutputDto> {
    return await this._addLessons.execute(input);
  }

  /**
   * Removes lessons from a schedule
   * @param input Schedule ID and lesson IDs to remove
   * @returns Updated schedule information
   */
  public async removeLessons(
    input: RemoveLessonsInputDto
  ): Promise<RemoveLessonsOutputDto> {
    return await this._removeLessons.execute(input);
  }
}
