import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Event from '@/modules/event-calendar-management/event/domain/entity/event.entity';

describe('Event unit test', () => {
  const eventData = {
    id: new Id(),
    creator: new Id().id,
    name: 'Formatura',
    date: new Date(),
    hour: '12:00' as Hour,
    day: 'mon' as DayOfWeek,
    type: 'Party',
    place: 'School',
  };

  describe('On fail', () => {
    it('should throw error when the input has missing values', () => {
      const event = {
        ...eventData,
        creator: undefined,
        name: undefined,
        date: undefined,
        hour: undefined,
        day: undefined,
        type: undefined,
        place: undefined,
      };

      expect(() => {
        //@ts-expect-error
        new Event(event);
      }).toThrow('All event fields are mandatory');
    });
    it('should throw error when setting an invalid name', () => {
      const event = new Event(eventData);
      expect(() => {
        event.name = '';
      }).toThrow('Field name is not valid');
    });

    it('should throw error when setting an invalid type', () => {
      const event = new Event(eventData);
      expect(() => {
        event.type = '';
      }).toThrow('Field type is not valid');
    });

    it('should throw error when setting an invalid place', () => {
      const event = new Event(eventData);
      expect(() => {
        event.place = '';
      }).toThrow('Field place is not valid');
    });
  });

  describe('On success', () => {
    it('should create an event with valid input', () => {
      const event = new Event(eventData);

      expect(event).toBeDefined();
      expect(event.id).toBe(eventData.id);
      expect(event.creator).toBe(eventData.creator);
      expect(event.name).toBe(eventData.name);
      expect(event.date).toBe(eventData.date);
      expect(event.hour).toBe(eventData.hour);
      expect(event.day).toBe(eventData.day);
      expect(event.type).toBe(eventData.type);
      expect(event.place).toBe(eventData.place);
    });

    it('should set a new name', () => {
      const event = new Event(eventData);

      event.name = 'New Event Name';

      expect(event.name).toBe('New Event Name');
    });

    it('should set a new type', () => {
      const event = new Event(eventData);

      event.type = 'New Event Type';

      expect(event.type).toBe('New Event Type');
    });

    it('should set a new place', () => {
      const event = new Event(eventData);

      event.place = 'New Event Place';

      expect(event.place).toBe('New Event Place');
    });
  });
});
