import Event from '@/modules/event-calendar-management/domain/entity/calendar.entity';
import EventGateway from '../../gateway/calendar.gateway';

export default class MemoryEventRepository implements EventGateway {
  private _events: Event[];

  constructor(events?: Event[]) {
    events ? (this._events = events) : (this._events = []);
  }

  async find(id: string): Promise<Event | undefined> {
    const event = this._events.find(event => event.id.value === id);
    if (event) {
      return event;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Event[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const events = this._events.slice(offS, qtd);

    return events;
  }
  async create(event: Event): Promise<string> {
    this._events.push(event);
    return event.id.value;
  }
  async update(event: Event): Promise<Event> {
    const eventIndex = this._events.findIndex(
      dBevent => dBevent.id.value === event.id.value
    );
    if (eventIndex !== -1) {
      return (this._events[eventIndex] = event);
    } else {
      throw new Error('Event not found');
    }
  }
  async delete(id: string): Promise<string> {
    const eventIndex = this._events.findIndex(
      dBevent => dBevent.id.value === id
    );
    if (eventIndex !== -1) {
      this._events.splice(eventIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Event not found');
    }
  }
}
