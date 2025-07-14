import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
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
} from '../../dto/event-facade.dto';
import CreateEvent from '../../usecases/event/create.usecase';
import DeleteEvent from '../../usecases/event/delete.usecase';
import FindAllEvent from '../../usecases/event/find-all.usecase';
import FindEvent from '../../usecases/event/find.usecase';
import UpdateEvent from '../../usecases/event/update.usecase';
import EventFacadeInterface from '../interface/event-facade.interface';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

/**
 * Properties required to initialize the EventFacade
 */
type EventFacadeProps = {
  readonly createEvent: CreateEvent;
  readonly deleteEvent: DeleteEvent;
  readonly findAllEvent: FindAllEvent;
  readonly findEvent: FindEvent;
  readonly updateEvent: UpdateEvent;
  readonly policiesService: PoliciesServiceInterface;
};

/**
 * Facade implementation for calendar event operations
 *
 * This class provides a unified interface to the underlying event
 * use cases, simplifying client interaction with the calendar subsystem.
 */
export default class EventFacade implements EventFacadeInterface {
  private readonly _createEvent: CreateEvent;
  private readonly _deleteEvent: DeleteEvent;
  private readonly _findAllEvent: FindAllEvent;
  private readonly _findEvent: FindEvent;
  private readonly _updateEvent: UpdateEvent;
  private readonly _policiesService: PoliciesServiceInterface;

  /**
   * Creates a new instance of EventFacade
   * @param input Dependencies required by the facade
   */
  constructor(input: EventFacadeProps) {
    this._createEvent = input.createEvent;
    this._deleteEvent = input.deleteEvent;
    this._findAllEvent = input.findAllEvent;
    this._findEvent = input.findEvent;
    this._updateEvent = input.updateEvent;
    this._policiesService = input.policiesService;
  }

  /**
   * Creates a new calendar event
   * @param input Event creation parameters
   * @returns Information about the created event
   */
  public async create(
    input: CreateEventInputDto,
    token: TokenData
  ): Promise<CreateEventOutputDto> {
    return await this._createEvent.execute(input, this._policiesService, token);
  }

  /**
   * Finds a calendar event by id
   * @param input Search parameters
   * @returns Event information if found, null otherwise
   */
  public async find(
    input: FindEventInputDto,
    token: TokenData
  ): Promise<FindEventOutputDto | null> {
    const result = await this._findEvent.execute(
      input,
      this._policiesService,
      token
    );
    return result || null;
  }

  /**
   * Retrieves all calendar events based on search criteria
   * @param input Search parameters
   * @returns List of events matching the criteria
   */
  public async findAll(
    input: FindAllEventInputDto,
    token: TokenData
  ): Promise<FindAllEventOutputDto> {
    return await this._findAllEvent.execute(
      input,
      this._policiesService,
      token
    );
  }

  /**
   * Deletes a calendar event
   * @param input Event identification
   * @returns Confirmation message
   */
  public async delete(
    input: DeleteEventInputDto,
    token: TokenData
  ): Promise<DeleteEventOutputDto> {
    return await this._deleteEvent.execute(input, this._policiesService, token);
  }

  /**
   * Updates a calendar event's information
   * @param input Event identification and data to update
   * @returns Updated event information
   */
  public async update(
    input: UpdateEventInputDto,
    token: TokenData
  ): Promise<UpdateEventOutputDto> {
    return await this._updateEvent.execute(input, this._policiesService, token);
  }
}
