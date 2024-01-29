import {
  DeleteEventInputDto,
  DeleteEventOutputDto,
} from '@/application/dto/event-calendar-management/event-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import EventGateway from '@/infraestructure/gateway/event-calendar-management/event.gateway';

export default class DeleteEvent
  implements UseCaseInterface<DeleteEventInputDto, DeleteEventOutputDto>
{
  private _eventRepository: EventGateway;

  constructor(eventRepository: EventGateway) {
    this._eventRepository = eventRepository;
  }
  async execute({ id }: DeleteEventInputDto): Promise<DeleteEventOutputDto> {
    const eventVerification = await this._eventRepository.find(id);
    if (!eventVerification) throw new Error('Event not found');

    const result = await this._eventRepository.delete(id);

    return { message: result };
  }
}
