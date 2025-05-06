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

/**
 * Controller for schedule management operations.
 * Handles HTTP requests by delegating to appropriate use cases.
 */
export class ScheduleController {
  /**
   * Creates a new ScheduleController instance.
   * @param createSchedule - Use case for creating a new schedule
   * @param findSchedule - Use case for finding a schedule
   * @param findAllSchedule - Use case for retrieving all schedules
   * @param updateSchedule - Use case for updating a schedule
   * @param deleteSchedule - Use case for deleting a schedule
   * @param addLessonstoSchedule - Use case for adding lessons to a schedule
   * @param removeLessonstoSchedule - Use case for removing lessons from a schedule
   */
  constructor(
    private readonly createSchedule: CreateSchedule,
    private readonly findSchedule: FindSchedule,
    private readonly findAllSchedule: FindAllSchedule,
    private readonly updateSchedule: UpdateSchedule,
    private readonly deleteSchedule: DeleteSchedule,
    private readonly addLessonstoSchedule: AddLessons,
    private readonly removeLessonstoSchedule: RemoveLessons
  ) {}

  /**
   * Creates a new schedule.
   * @param input - The data for creating a new schedule
   * @returns Promise resolving to the created schedule data
   */
  async create(
    input: CreateScheduleInputDto
  ): Promise<CreateScheduleOutputDto> {
    const response = await this.createSchedule.execute(input);
    return response;
  }

  /**
   * Finds a schedule by its identifier.
   * @param input - The input containing the identifier to search for
   * @returns Promise resolving to the found schedule data or undefined
   */
  async find(
    input: FindScheduleInputDto
  ): Promise<FindScheduleOutputDto | undefined> {
    const response = await this.findSchedule.execute(input);
    return response;
  }

  /**
   * Retrieves all schedules matching the specified criteria.
   * @param input - The input containing search criteria
   * @returns Promise resolving to the list of schedules
   */
  async findAll(
    input: FindAllScheduleInputDto
  ): Promise<FindAllScheduleOutputDto> {
    const response = await this.findAllSchedule.execute(input);
    return response;
  }

  /**
   * Deletes a schedule.
   * @param input - The input containing the identifier of the schedule to delete
   * @returns Promise resolving to the deletion confirmation
   */
  async delete(
    input: DeleteScheduleInputDto
  ): Promise<DeleteScheduleOutputDto> {
    const response = await this.deleteSchedule.execute(input);
    return response;
  }

  /**
   * Updates a schedule.
   * @param input - The input containing the schedule data to update
   * @returns Promise resolving to the updated schedule data
   */
  async update(
    input: UpdateScheduleInputDto
  ): Promise<UpdateScheduleOutputDto> {
    const response = await this.updateSchedule.execute(input);
    return response;
  }

  /**
   * Adds lessons to a schedule.
   * @param input - The input containing schedule ID and lesson IDs to add
   * @returns Promise resolving to the updated schedule with added lessons
   */
  async addLessons(input: AddLessonsInputDto): Promise<AddLessonsOutputDto> {
    const response = await this.addLessonstoSchedule.execute(input);
    return response;
  }

  /**
   * Removes lessons from a schedule.
   * @param input - The input containing schedule ID and lesson IDs to remove
   * @returns Promise resolving to the updated schedule with removed lessons
   */
  async removeLessons(
    input: RemoveLessonsInputDto
  ): Promise<RemoveLessonsOutputDto> {
    const response = await this.removeLessonstoSchedule.execute(input);
    return response;
  }
}
