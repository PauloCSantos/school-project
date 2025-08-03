import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllEventInputDto,
  FindAllEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/application/gateway/event.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

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
  constructor(
    eventRepository: EventGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._eventRepository = eventRepository;
  }

  /**
   * Executes the search for all events with pagination.
   *
   * @param input - Input data containing pagination parameters (offset and quantity)
   * @returns Array of event data matching the pagination criteria
   */
  async execute(
    { offset, quantity }: FindAllEventInputDto,
    token?: TokenData
  ): Promise<FindAllEventOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.EVENT,
      FunctionCalledEnum.FIND_ALL,
      token
    );
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
