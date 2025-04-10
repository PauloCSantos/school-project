import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllEventInputDto,
  FindAllEventOutputDto,
} from '../../dto/calendar-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/calendar.gateway';

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
      id: event.id.value,
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
