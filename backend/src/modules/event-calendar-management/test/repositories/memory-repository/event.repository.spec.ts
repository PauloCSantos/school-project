import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';
import MemoryEventRepository from '@/modules/event-calendar-management/infrastructure/repositories/memory-repository/event.repository';

describe('MemoryEventRepository unit test', () => {
  let repository: MemoryEventRepository;

  const masterId = new Id().value;
  const event1 = new Event({
    creator: new Id().value,
    name: 'Event',
    date: new Date('05/22/24'),
    hour: '07:00' as Hour,
    day: 'mon' as DayOfWeek,
    type: 'mandatory',
    place: 'school',
  });

  const event2 = new Event({
    creator: new Id().value,
    name: 'Party',
    date: new Date('08/11/24'),
    hour: '21:00' as Hour,
    day: 'sun' as DayOfWeek,
    type: 'not obligatory',
    place: 'address x',
  });

  const event3 = new Event({
    creator: new Id().value,
    name: 'Graduation',
    date: new Date('12/04/24'),
    hour: '14:00' as Hour,
    day: 'wed' as DayOfWeek,
    type: 'mandatory',
    place: 'address y',
  });

  beforeEach(() => {
    repository = new MemoryEventRepository([{ masterId, records: [event1, event2] }]);
  });

  describe('On fail', () => {
    it('should return null if event not found', async () => {
      const eventId = new Id().value;
      const eventFound = await repository.find(masterId, eventId);

      expect(eventFound).toBeNull();
    });

    it('should throw an error when trying to update a non-existent event', async () => {
      const newEvent = new Event({
        id: new Id(),
        creator: event3.creator,
        name: event3.name,
        date: event3.date,
        hour: event3.hour,
        day: event3.day,
        type: event3.type,
        place: event3.place,
      });

      await expect(repository.update(masterId, newEvent)).rejects.toThrow(
        'Event not found'
      );
    });

    it('should throw an error when trying to delete a non-existent event', async () => {
      const event = new Event({
        id: new Id(),
        creator: event3.creator,
        name: event3.name,
        date: event3.date,
        hour: event3.hour,
        day: event3.day,
        type: event3.type,
        place: event3.place,
      });
      await expect(repository.delete(masterId, event)).rejects.toThrow('Event not found');
    });
  });

  describe('On success', () => {
    it('should find an existing event by id', async () => {
      const eventId = event1.id.value;
      const eventFound = await repository.find(masterId, eventId);

      expect(eventFound).toBeDefined();
      expect(eventFound!.id).toBeDefined();
      expect(eventFound!.name).toBe(event1.name);
      expect(eventFound!.creator).toBe(event1.creator);
      expect(eventFound!.date).toBe(event1.date);
      expect(eventFound!.day).toBe(event1.day);
      expect(eventFound!.hour).toBe(event1.hour);
      expect(eventFound!.place).toBe(event1.place);
    });

    it('should create a new event and return its id', async () => {
      const result = await repository.create(masterId, event3);

      expect(result).toBe(event3.id.value);
    });

    it('should update an existing event and return its updated information', async () => {
      const updatedEvent = event2;
      updatedEvent.name = 'Happy hour';
      updatedEvent.day = 'mon';

      const result = await repository.update(masterId, updatedEvent);
      expect(result).toEqual(updatedEvent);
    });

    it('should find all events', async () => {
      const allEvents = await repository.findAll(masterId);

      expect(allEvents.length).toBe(2);
      expect(allEvents[0].name).toBe(event1.name);
      expect(allEvents[1].name).toBe(event2.name);
      expect(allEvents[0].date).toBe(event1.date);
      expect(allEvents[1].date).toBe(event2.date);
      expect(allEvents[0].creator).toBe(event1.creator);
      expect(allEvents[1].creator).toBe(event2.creator);
    });

    it('should delete an existing event', async () => {
      const response = await repository.delete(masterId, event1);

      expect(response).toBe('Operation completed successfully');
    });
  });
});
