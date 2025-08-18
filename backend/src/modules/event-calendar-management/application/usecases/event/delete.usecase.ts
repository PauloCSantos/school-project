import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteEventInputDto,
  DeleteEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/application/gateway/event.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for deleting a calendar event.
 *
 * Verifies event existence before proceeding with deletion.
 */
export default class DeleteEvent
  implements UseCaseInterface<DeleteEventInputDto, DeleteEventOutputDto>
{
  /** Repository for persisting and retrieving events */
  private readonly _eventRepository: EventGateway;

  /**
   * Constructs a new instance of the DeleteEvent use case.
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
   * Executes the deletion of a calendar event.
   *
   * @param input - Input data containing the id of the event to delete
   * @returns Output data with the result message
   * @throws Error if the event with the specified id does not exist
   */
  async execute(
    { id }: DeleteEventInputDto,
    token: TokenData
  ): Promise<DeleteEventOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.EVENT,
      FunctionCalledEnum.DELETE,
      token
    );

    const existingEvent = await this._eventRepository.find(token.masterId, id);
    if (!existingEvent) throw new Error('Event not found');

    const result = await this._eventRepository.delete(token.masterId, id);

    return { message: result };
  }
}
