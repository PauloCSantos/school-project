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
} from '../../application/dto/event-usecase.dto';
import CreateEvent from '../../application/usecases/event/create.usecase';
import DeleteEvent from '../../application/usecases/event/delete.usecase';
import FindAllEvent from '../../application/usecases/event/find-all.usecase';
import FindEvent from '../../application/usecases/event/find.usecase';
import UpdateEvent from '../../application/usecases/event/update.usecase';

/**
 * Controller for event calendar management operations.
 * Handles HTTP requests by delegating to appropriate use cases.
 */
export default class EventController {
  /**
   * Creates a new EventController instance.
   * @param createEvent - Use case for creating a new event
   * @param findEvent - Use case for finding an event by ID
   * @param findAllEvent - Use case for retrieving multiple events
   * @param updateEvent - Use case for updating an existing event
   * @param deleteEvent - Use case for deleting an event
   */
  constructor(
    private readonly createEvent: CreateEvent,
    private readonly findEvent: FindEvent,
    private readonly findAllEvent: FindAllEvent,
    private readonly updateEvent: UpdateEvent,
    private readonly deleteEvent: DeleteEvent
  ) {}

  /**
   * Creates a new calendar event.
   * @param input - The data for creating a new event
   * @returns Promise resolving to the created event data
   */
  async create(input: CreateEventInputDto): Promise<CreateEventOutputDto> {
    const response = await this.createEvent.execute(input);
    return response;
  }

  /**
   * Finds an event by ID.
   * @param input - The input containing the ID to search for
   * @returns Promise resolving to the found event data or null
   */
  async find(input: FindEventInputDto): Promise<FindEventOutputDto | null> {
    const response = await this.findEvent.execute(input);
    return response;
  }

  /**
   * Retrieves multiple events with optional pagination.
   * @param input - The input containing search and pagination parameters
   * @returns Promise resolving to the collection of events
   */
  async findAll(input: FindAllEventInputDto): Promise<FindAllEventOutputDto> {
    const response = await this.findAllEvent.execute(input);
    return response;
  }

  /**
   * Deletes an event by ID.
   * @param input - The input containing the ID of the event to delete
   * @returns Promise resolving to the deletion confirmation
   */
  async delete(input: DeleteEventInputDto): Promise<DeleteEventOutputDto> {
    const response = await this.deleteEvent.execute(input);
    return response;
  }

  /**
   * Updates an existing event.
   * @param input - The input containing the event data to update
   * @returns Promise resolving to the updated event data
   */
  async update(input: UpdateEventInputDto): Promise<UpdateEventOutputDto> {
    const response = await this.updateEvent.execute(input);
    return response;
  }
}
