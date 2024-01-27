import {
  FindAllEventInputDto,
  FindAllEventOutputDto,
} from '@/application/dto/event-calendar-management/event-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import EventGateway from '@/modules/event-calendar-management/event/gateway/event.gateway';

export default class FindAllEvent
  implements UseCaseInterface<FindAllEventInputDto, FindAllEventOutputDto>
{
  private _eventRepository: EventGateway;

  constructor(eventRepository: EventGateway) {
    this._eventRepository = eventRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllEventInputDto): Promise<FindAllEventOutputDto> {
    const results = await this._eventRepository.findAll(offset, quantity);

    const result = results.map(event => ({
      creator: event.creator,
      name: event.name,
      date: event.date,
      hour: event.hour,
      day: event.day,
      type: event.type,
      place: event.place,
    }));

    return result;
  }
}
