import Event from '@/modules/event-calendar-management/event/domain/entity/event.entity';
import EventGateway from '@/modules/event-calendar-management/event/gateway/event.gateway';

export default class MemoryEventRepository implements EventGateway {
  private _events: Event[];

  constructor(events?: Event[]) {
    events ? (this._events = events) : (this._events = []);
  }

  async find(id: string): Promise<Omit<Event, 'id'> | undefined> {
    const event = this._events.find(event => event.id.id === id);
    if (event) {
      return event;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Omit<Event, 'id'>[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const events = this._events.slice(offS, qtd);

    return events;
  }
  async create(event: Event): Promise<string> {
    this._events.push(event);
    return event.id.id;
  }
  async update(event: Event): Promise<Omit<Event, 'id'>> {
    const eventIndex = this._events.findIndex(
      dBevent => dBevent.id.id === event.id.id
    );
    if (eventIndex !== -1) {
      return (this._events[eventIndex] = event);
    } else {
      throw new Error('Event not found');
    }
  }
  async delete(id: string): Promise<string> {
    const eventIndex = this._events.findIndex(dBevent => dBevent.id.id === id);
    if (eventIndex !== -1) {
      this._events.splice(eventIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Event not found');
    }
  }
}
