import {
  CreateEventInputDto,
  CreateEventOutputDto,
} from '@/application/dto/event-calendar-management/event-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';

import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import EventGateway from '@/infraestructure/gateway/event-calendar-management/event.gateway';

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
