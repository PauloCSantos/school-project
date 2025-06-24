import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindEventInputDto,
  FindEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/event.gateway';

/**
 * Use case responsible for finding an event by ID.
 *
 * Retrieves event information from the repository and maps it to the appropriate output format.
 */
export default class FindEvent
  implements UseCaseInterface<FindEventInputDto, FindEventOutputDto | null>
{
  /** Repository for persisting and retrieving events */
  private readonly _eventRepository: EventGateway;

  /**
   * Constructs a new instance of the FindEvent use case.
   *
   * @param eventRepository - Gateway implementation for data persistence
   */
  constructor(eventRepository: EventGateway) {
    this._eventRepository = eventRepository;
  }

  /**
   * Executes the search for an event by ID.
   *
   * @param input - Input data containing the ID to search for
   * @returns Event data if found, undefined otherwise
   */
  async execute({ id }: FindEventInputDto): Promise<FindEventOutputDto | null> {
    const response = await this._eventRepository.find(id);

    if (response) {
      return {
        id: response.id.value,
        creator: response.creator,
        name: response.name,
        date: response.date,
        hour: response.hour,
        day: response.day,
        type: response.type,
        place: response.place,
      };
    }

    return null;
  }
}
