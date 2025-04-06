import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindEventInputDto,
  FindEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/event.gateway';

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
        id: response.id.id,
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
