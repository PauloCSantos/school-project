import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteEventInputDto,
  DeleteEventOutputDto,
} from '../../dto/event-usecase.dto';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/event.gateway';

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
