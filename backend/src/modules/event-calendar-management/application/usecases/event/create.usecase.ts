import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateEventInputDto,
  CreateEventOutputDto,
} from '../../dto/calendar-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/calendar.gateway';
import Event from '@/modules/event-calendar-management/domain/entity/calendar.entity';

/**
 * Use case responsible for creating a new calendar event.
 *
 * Checks for event uniqueness and persists the event in the repository.
 */
export default class CreateEvent
  implements UseCaseInterface<CreateEventInputDto, CreateEventOutputDto>
{
  /** Repository for persisting and retrieving events */
  private readonly _eventRepository: EventGateway;

  /**
   * Constructs a new instance of the CreateEvent use case.
   *
   * @param eventRepository - Gateway implementation for event data persistence
   */
  constructor(eventRepository: EventGateway) {
    this._eventRepository = eventRepository;
  }

  /**
   * Executes the creation of a new calendar event.
   *
   * @param input - Input data including creator, date, day, hour, name, place, and type
   * @returns Output data containing the ID of the created event
   * @throws Error if an event with the same ID already exists
   * @throws ValidationError if any of the input data fails validation during entity creation
   */
  async execute({
    creator,
    date,
    day,
    hour,
    name,
    place,
    type,
  }: CreateEventInputDto): Promise<CreateEventOutputDto> {
    // Create event entity with provided input
    const event = new Event({
      creator,
      date,
      day,
      hour,
      name,
      place,
      type,
    });

    // Check if event already exists
    const existingEvent = await this._eventRepository.find(event.id.value);
    if (existingEvent) {
      throw new Error('Event already exists');
    }

    // Persist the event
    const result = await this._eventRepository.create(event);

    return { id: result };
  }
}
