import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateEventInputDto,
  CreateEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/event.gateway';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';

export default class CreateEvent
  implements UseCaseInterface<CreateEventInputDto, CreateEventOutputDto>
{
  private _eventRepository: EventGateway;

  constructor(eventRepository: EventGateway) {
    this._eventRepository = eventRepository;
  }
  async execute({
    creator,
    date,
    day,
    hour,
    name,
    place,
    type,
  }: CreateEventInputDto): Promise<CreateEventOutputDto> {
    const event = new Event({
      creator,
      date,
      day,
      hour,
      name,
      place,
      type,
    });

    const eventVerification = await this._eventRepository.find(event.id.id);
    if (eventVerification) throw new Error('Event already exists');

    const result = await this._eventRepository.create(event);

    return { id: result };
  }
}
