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

    try {
      name !== undefined && (event.name = name);
      creator !== undefined && (event.creator = creator);
      date !== undefined && (event.date = date);
      day !== undefined && (event.day = day);
      hour !== undefined && (event.hour = hour);
      place !== undefined && (event.place = place);
      type !== undefined && (event.type = type);

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
    } catch (error) {
      throw error;
    }
  }
}
