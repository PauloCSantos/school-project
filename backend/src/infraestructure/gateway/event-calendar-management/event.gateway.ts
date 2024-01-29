import Event from '../../../modules/event-calendar-management/domain/entity/event.entity';

export default interface EventGateway {
  find(id: string): Promise<Event | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Event[]>;
  create(event: Event): Promise<string>;
  update(event: Event): Promise<Event>;
  delete(id: string): Promise<string>;
}
