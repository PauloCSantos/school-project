import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
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
import { TokenData } from '@/modules/@shared/type/sharedTypes';

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
    private readonly removeLessonstoSchedule: RemoveLessons,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  /**
   * Creates a new schedule.
   * @param input - The data for creating a new schedule
   * @returns Promise resolving to the created schedule data
   */
  async create(
    input: CreateScheduleInputDto,
    token: TokenData
  ): Promise<CreateScheduleOutputDto> {
    const response = await this.createSchedule.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Finds a schedule by its identifier.
   * @param input - The input containing the identifier to search for
   * @returns Promise resolving to the found schedule data or null
   */
  async find(
    input: FindScheduleInputDto,
    token: TokenData
  ): Promise<FindScheduleOutputDto | null> {
    const response = await this.findSchedule.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Retrieves all schedules matching the specified criteria.
   * @param input - The input containing search criteria
   * @returns Promise resolving to the list of schedules
   */
  async findAll(
    input: FindAllScheduleInputDto,
    token: TokenData
  ): Promise<FindAllScheduleOutputDto> {
    const response = await this.findAllSchedule.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Deletes a schedule.
   * @param input - The input containing the identifier of the schedule to delete
   * @returns Promise resolving to the deletion confirmation
   */
  async delete(
    input: DeleteScheduleInputDto,
    token: TokenData
  ): Promise<DeleteScheduleOutputDto> {
    const response = await this.deleteSchedule.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Updates a schedule.
   * @param input - The input containing the schedule data to update
   * @returns Promise resolving to the updated schedule data
   */
  async update(
    input: UpdateScheduleInputDto,
    token: TokenData
  ): Promise<UpdateScheduleOutputDto> {
    const response = await this.updateSchedule.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Adds lessons to a schedule.
   * @param input - The input containing schedule ID and lesson IDs to add
   * @returns Promise resolving to the updated schedule with added lessons
   */
  async addLessons(
    input: AddLessonsInputDto,
    token: TokenData
  ): Promise<AddLessonsOutputDto> {
    const response = await this.addLessonstoSchedule.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }

  /**
   * Removes lessons from a schedule.
   * @param input - The input containing schedule ID and lesson IDs to remove
   * @returns Promise resolving to the updated schedule with removed lessons
   */
  async removeLessons(
    input: RemoveLessonsInputDto,
    token: TokenData
  ): Promise<RemoveLessonsOutputDto> {
    const response = await this.removeLessonstoSchedule.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
}
