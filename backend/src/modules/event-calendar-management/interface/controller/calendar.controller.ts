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
} from '../../application/dto/calendar-usecase.dto';
import CreateEvent from '../../application/usecases/event/create.usecase';
import DeleteEvent from '../../application/usecases/event/delete.usecase';
import FindAllEvent from '../../application/usecases/event/find-all.usecase';
import FindEvent from '../../application/usecases/event/find.usecase';
import UpdateEvent from '../../application/usecases/event/update.usecase';

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
