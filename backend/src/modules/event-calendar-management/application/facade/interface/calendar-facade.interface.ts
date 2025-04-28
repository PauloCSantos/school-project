import {
  CreateEventInputDto,
  CreateEventOutputDto,
  DeleteEventInputDto,
  DeleteEventOutputDto,
  FindAllEventInputDto,
  FindAllEventOutputDto,
  FindEventInputDto,
  FindEventOutputDto,
  UpdateEventInputDto,
  UpdateEventOutputDto,
} from '../../dto/calendar-facade.dto';

/**
 * Interface for calendar event operations
 *
 * Provides methods for CRUD operations on calendar events
 */
export default interface EventFacadeInterface {
  /**
   * Creates a new calendar event
   * @param input Event creation parameters
   * @returns Information about the created event
   */
  create(input: CreateEventInputDto): Promise<CreateEventOutputDto>;

  /**
   * Finds a calendar event by id
   * @param input Search parameters
   * @returns Event information if found, null otherwise
   */
  find(input: FindEventInputDto): Promise<FindEventOutputDto | null>;

  /**
   * Retrieves all calendar events based on search criteria
   * @param input Search parameters
   * @returns List of events matching the criteria
   */
  findAll(input: FindAllEventInputDto): Promise<FindAllEventOutputDto>;

  /**
   * Deletes a calendar event
   * @param input Event identification
   * @returns Confirmation message
   */
  delete(input: DeleteEventInputDto): Promise<DeleteEventOutputDto>;

  /**
   * Updates a calendar event's information
   * @param input Event identification and data to update
   * @returns Updated event information
   */
  update(input: UpdateEventInputDto): Promise<UpdateEventOutputDto>;
}
