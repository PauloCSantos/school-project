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
} from '../../application/dto/event-usecase.dto';
import CreateEvent from '../../application/usecases/event/createEvent.usecase';
import DeleteEvent from '../../application/usecases/event/deleteEvent.usecase';
import FindAllEvent from '../../application/usecases/event/findAllEvent.usecase';
import FindEvent from '../../application/usecases/event/findEvent.usecase';
import UpdateEvent from '../../application/usecases/event/updateEvent.usecase';

export class EventController {
  constructor(
    private readonly createEvent: CreateEvent,
    private readonly findEvent: FindEvent,
    private readonly findAllEvent: FindAllEvent,
    private readonly updateEvent: UpdateEvent,
    private readonly deleteEvent: DeleteEvent
  ) {}

  async create(input: CreateEventInputDto): Promise<CreateEventOutputDto> {
    const response = await this.createEvent.execute(input);
    return response;
  }
  async find(
    input: FindEventInputDto
  ): Promise<FindEventOutputDto | undefined> {
    const response = await this.findEvent.execute(input);
    return response;
  }
  async findAll(input: FindAllEventInputDto): Promise<FindAllEventOutputDto> {
    const response = await this.findAllEvent.execute(input);
    return response;
  }
  async delete(input: DeleteEventInputDto): Promise<DeleteEventOutputDto> {
    const response = await this.deleteEvent.execute(input);
    return response;
  }
  async update(input: UpdateEventInputDto): Promise<UpdateEventOutputDto> {
    const response = await this.updateEvent.execute(input);
    return response;
  }
}
