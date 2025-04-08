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
} from '../../dto/calendar-facade.dto';
import CreateEvent from '../../usecases/event/create.usecase';
import DeleteEvent from '../../usecases/event/delete.usecase';
import FindAllEvent from '../../usecases/event/find-all.usecase';
import FindEvent from '../../usecases/event/find.usecase';
import UpdateEvent from '../../usecases/event/update.usecase';
import EventFacadeInterface from '../interface/calendar-facade.interface';

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
