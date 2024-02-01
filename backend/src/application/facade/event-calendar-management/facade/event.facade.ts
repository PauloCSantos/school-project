import CreateEvent from '@/application/usecases/event-calendar-management/event/createEvent.usecase';
import DeleteEvent from '@/application/usecases/event-calendar-management/event/deleteEvent.usecase';
import FindAllEvent from '@/application/usecases/event-calendar-management/event/findAllEvent.usecase';
import FindEvent from '@/application/usecases/event-calendar-management/event/findEvent.usecase';
import UpdateEvent from '@/application/usecases/event-calendar-management/event/updateEvent.usecase';
import EventFacadeInterface from '../interface/event-facade.interface';
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
} from '@/application/dto/event-calendar-management/event-facade.dto';

type EventFacadeProps = {
  createEvent: CreateEvent;
  deleteEvent: DeleteEvent;
  findAllEvent: FindAllEvent;
  findEvent: FindEvent;
  updateEvent: UpdateEvent;
};
export default class EventFacade implements EventFacadeInterface {
  private _createEvent: CreateEvent;
  private _deleteEvent: DeleteEvent;
  private _findAllEvent: FindAllEvent;
  private _findEvent: FindEvent;
  private _updateEvent: UpdateEvent;

  constructor(input: EventFacadeProps) {
    this._createEvent = input.createEvent;
    this._deleteEvent = input.deleteEvent;
    this._findAllEvent = input.findAllEvent;
    this._findEvent = input.findEvent;
    this._updateEvent = input.updateEvent;
  }

  async create(input: CreateEventInputDto): Promise<CreateEventOutputDto> {
    return await this._createEvent.execute(input);
  }
  async find(
    input: FindEventInputDto
  ): Promise<FindEventOutputDto | undefined> {
    return await this._findEvent.execute(input);
  }
  async findAll(input: FindAllEventInputDto): Promise<FindAllEventOutputDto> {
    return await this._findAllEvent.execute(input);
  }
  async delete(input: DeleteEventInputDto): Promise<DeleteEventOutputDto> {
    return await this._deleteEvent.execute(input);
  }
  async update(input: UpdateEventInputDto): Promise<UpdateEventOutputDto> {
    return await this._updateEvent.execute(input);
  }
}
