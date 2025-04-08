import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  CreateEventInputDto,
  CreateEventOutputDto,
} from '../../dto/calendar-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/calendar.gateway';
import Event from '@/modules/event-calendar-management/domain/entity/calendar.entity';

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

    const eventVerification = await this._eventRepository.find(event.id.value);
    if (eventVerification) throw new Error('Event already exists');

    const result = await this._eventRepository.create(event);

    return { id: result };
  }
}
