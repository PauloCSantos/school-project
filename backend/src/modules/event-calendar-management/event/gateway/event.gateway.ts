import Event from '../domain/entity/event.entity';

export default interface EventGateway {
  find(id: string): Promise<Omit<Event, 'id'> | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Omit<Event, 'id'>[]>;
  create(event: Event): Promise<string>;
  update(event: Event): Promise<Omit<Event, 'id'>>;
  delete(id: string): Promise<string>;
}
