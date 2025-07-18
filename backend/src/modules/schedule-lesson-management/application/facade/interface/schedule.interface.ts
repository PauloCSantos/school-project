import { TokenData } from '@/modules/@shared/type/sharedTypes';
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
} from '../../dto/schedule-facade.dto';

/**
 * Interface for schedule operations
 *
 * Provides methods for CRUD operations on schedules and
 * schedule-specific functionality
 */
export default interface ScheduleFacadeInterface {
  /**
   * Creates a new schedule
   * @param input Schedule creation parameters
   * @returns Information about the created schedule
   */
  create(
    input: CreateScheduleInputDto,
    token: TokenData
  ): Promise<CreateScheduleOutputDto>;

  /**
   * Finds a schedule by ID
   * @param input Search parameters
   * @returns Schedule information if found, null otherwise
   */
  find(
    input: FindScheduleInputDto,
    token: TokenData
  ): Promise<FindScheduleOutputDto | null>;

  /**
   * Retrieves all schedules with optional filtering
   * @param input Search parameters for filtering schedules
   * @returns Collection of schedules matching criteria
   */
  findAll(
    input: FindAllScheduleInputDto,
    token: TokenData
  ): Promise<FindAllScheduleOutputDto>;

  /**
   * Deletes a schedule
   * @param input Schedule identification
   * @returns Confirmation message
   */
  delete(
    input: DeleteScheduleInputDto,
    token: TokenData
  ): Promise<DeleteScheduleOutputDto>;

  /**
   * Updates a schedule's information
   * @param input Schedule identification and data to update
   * @returns Updated schedule information
   */
  update(
    input: UpdateScheduleInputDto,
    token: TokenData
  ): Promise<UpdateScheduleOutputDto>;

  /**
   * Adds lessons to a schedule
   * @param input Schedule ID and lesson IDs to add
   * @returns Updated schedule information
   */
  addLessons(
    input: AddLessonsInputDto,
    token: TokenData
  ): Promise<AddLessonsOutputDto>;

  /**
   * Removes lessons from a schedule
   * @param input Schedule ID and lesson IDs to remove
   * @returns Updated schedule information
   */
  removeLessons(
    input: RemoveLessonsInputDto,
    token: TokenData
  ): Promise<RemoveLessonsOutputDto>;
}
