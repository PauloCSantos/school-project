import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindEventInputDto,
  FindEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/application/gateway/event.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { EventMapper } from '@/modules/event-calendar-management/infrastructure/mapper/event.mapper';

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
  constructor(
    eventRepository: EventGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._eventRepository = eventRepository;
  }

  /**
   * Executes the search for an event by ID.
   *
   * @param input - Input data containing the ID to search for
   * @returns Event data if found, undefined otherwise
   */
  async execute(
    { id }: FindEventInputDto,
    token: TokenData
  ): Promise<FindEventOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.EVENT,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._eventRepository.find(token.masterId, id);

    if (response) {
      return EventMapper.toObj(response);
    }

    return null;
  }
}
