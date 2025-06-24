import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteEventInputDto,
  DeleteEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/event.gateway';

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
  constructor(eventRepository: EventGateway) {
    this._eventRepository = eventRepository;
  }

  /**
   * Executes the deletion of a calendar event.
   *
   * @param input - Input data containing the id of the event to delete
   * @returns Output data with the result message
   * @throws Error if the event with the specified id does not exist
   */
  async execute({ id }: DeleteEventInputDto): Promise<DeleteEventOutputDto> {
    const existingEvent = await this._eventRepository.find(id);
    if (!existingEvent) throw new Error('Event not found');

    const result = await this._eventRepository.delete(id);

    return { message: result };
  }
}
