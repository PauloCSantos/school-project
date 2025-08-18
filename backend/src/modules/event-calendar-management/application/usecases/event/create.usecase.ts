import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateEventInputDto,
  CreateEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/application/gateway/event.gateway';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

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
  constructor(
    eventRepository: EventGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
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
  async execute(
    { creator, date, day, hour, name, place, type }: CreateEventInputDto,
    token: TokenData
  ): Promise<CreateEventOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.EVENT,
      FunctionCalledEnum.CREATE,
      token
    );
    const event = new Event({
      creator,
      date: new Date(date),
      day,
      hour,
      name,
      place,
      type,
    });

    const result = await this._eventRepository.create(token.masterId, event);

    return { id: result };
  }
}
