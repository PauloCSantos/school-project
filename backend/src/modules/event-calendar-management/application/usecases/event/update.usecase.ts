import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateEventInputDto,
  UpdateEventOutputDto,
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
 * Use case responsible for updating an event.
 *
 * Verifies event existence, applies updates, and persists changes.
 */
export default class UpdateEvent
  implements UseCaseInterface<UpdateEventInputDto, UpdateEventOutputDto>
{
  /** Repository for persisting and retrieving events */
  private readonly _eventRepository: EventGateway;

  /**
   * Constructs a new instance of the UpdateEvent use case.
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
   * Executes the update of an event.
   *
   * @param input - Input data containing the event ID and fields to update
   * @returns Output data of the updated event
   * @throws Error if the event with the specified ID does not exist
   */
  async execute(
    { id, creator, date, day, hour, name, place, type }: UpdateEventInputDto,
    token?: TokenData
  ): Promise<UpdateEventOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.EVENT,
      FunctionCalledEnum.CREATE,
      token
    );
    const existingEvent = await this._eventRepository.find(id);

    if (!existingEvent) {
      throw new Error('Event not found');
    }

    const event = new Event({
      id: existingEvent.id,
      creator: existingEvent.creator,
      name: existingEvent.name,
      date: existingEvent.date,
      hour: existingEvent.hour,
      day: existingEvent.day,
      type: existingEvent.type,
      place: existingEvent.place,
    });

    if (name !== undefined) {
      event.name = name;
    }

    if (creator !== undefined) {
      event.creator = creator;
    }

    if (date !== undefined) {
      event.date = date;
    }

    if (day !== undefined) {
      event.day = day;
    }

    if (hour !== undefined) {
      event.hour = hour;
    }

    if (place !== undefined) {
      event.place = place;
    }

    if (type !== undefined) {
      event.type = type;
    }

    const result = await this._eventRepository.update(event);

    return {
      id: result.id.value,
      creator: result.creator,
      name: result.name,
      date: result.date,
      hour: result.hour,
      day: result.day,
      type: result.type,
      place: result.place,
    };
  }
}
