import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllEventInputDto,
  FindAllEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/event.gateway';

/**
 * Use case responsible for finding all events with pagination.
 *
 * Retrieves paginated event information from the repository and maps it to the appropriate output format.
 */
export default class FindAllEvent
  implements UseCaseInterface<FindAllEventInputDto, FindAllEventOutputDto>
{
  /** Repository for persisting and retrieving events */
  private readonly _eventRepository: EventGateway;

  /**
   * Constructs a new instance of the FindAllEvent use case.
   *
   * @param eventRepository - Gateway implementation for data persistence
   */
  constructor(eventRepository: EventGateway) {
    this._eventRepository = eventRepository;
  }

  /**
   * Executes the search for all events with pagination.
   *
   * @param input - Input data containing pagination parameters (offset and quantity)
   * @returns Array of event data matching the pagination criteria
   */
  async execute({
    offset,
    quantity,
  }: FindAllEventInputDto): Promise<FindAllEventOutputDto> {
    const results = await this._eventRepository.findAll(quantity, offset);

    return results.map(event => ({
      id: event.id.value,
      creator: event.creator,
      name: event.name,
      date: event.date,
      hour: event.hour,
      day: event.day,
      type: event.type,
      place: event.place,
    }));
  }
}
