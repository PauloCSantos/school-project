import {
  FindEventInputDto,
  FindEventOutputDto,
} from '@/application/dto/event-calendar-management/event-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import EventGateway from '@/infraestructure/gateway/event-calendar-management/event.gateway';

export default class FindEvent
  implements
    UseCaseInterface<FindEventInputDto, FindEventOutputDto | undefined>
{
  private _eventRepository: EventGateway;

  constructor(eventRepository: EventGateway) {
    this._eventRepository = eventRepository;
  }
  async execute({
    id,
  }: FindEventInputDto): Promise<FindEventOutputDto | undefined> {
    const response = await this._eventRepository.find(id);
    if (response) {
      return {
        creator: response.creator,
        name: response.name,
        date: response.date,
        hour: response.hour,
        day: response.day,
        type: response.type,
        place: response.place,
      };
    } else {
      return response;
    }
  }
}
