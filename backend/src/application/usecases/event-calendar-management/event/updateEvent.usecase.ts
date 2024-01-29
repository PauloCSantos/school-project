import {
  UpdateEventInputDto,
  UpdateEventOutputDto,
} from '@/application/dto/event-calendar-management/event-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import EventGateway from '@/infraestructure/gateway/event-calendar-management/event.gateway';

export default class UpdateEvent
  implements UseCaseInterface<UpdateEventInputDto, UpdateEventOutputDto>
{
  private _eventRepository: EventGateway;

  constructor(eventRepository: EventGateway) {
    this._eventRepository = eventRepository;
  }
  async execute({
    id,
    creator,
    date,
    day,
    hour,
    name,
    place,
    type,
  }: UpdateEventInputDto): Promise<UpdateEventOutputDto> {
    const event = await this._eventRepository.find(id);
    if (!event) throw new Error('Event not found');

    name && (event.name = name);
    creator && (event.creator = creator);
    date && (event.date = date);
    day && (event.day = day);
    hour && (event.hour = hour);
    place && (event.place = place);
    type && (event.type = type);

    const result = await this._eventRepository.update(event);

    return {
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
