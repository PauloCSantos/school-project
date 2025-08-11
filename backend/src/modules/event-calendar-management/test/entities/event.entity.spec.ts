import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';

describe('Event unit test', () => {
  const baseEventData = {
    id: new Id(),
    creator: new Id().value,
    name: 'Formatura',
    date: new Date(),
    hour: '12:00' as Hour,
    day: 'mon' as DayOfWeek,
    type: 'Party',
    place: 'School',
  };

  let event: Event;

  beforeEach(() => {
    event = new Event({ ...baseEventData });
  });

  describe('Failure cases', () => {
    it('should throw error when the input has missing values', () => {
      expect(() => {
        //@ts-expect-error
        new Event({});
      }).toThrow('All event fields are mandatory');
    });

    it('should throw error when setting an invalid name', () => {
      expect(() => {
        event.name = '';
      }).toThrow('Field name is not valid');
    });

    it('should throw error when setting an invalid type', () => {
      expect(() => {
        event.type = '';
      }).toThrow('Field type is not valid');
    });

    it('should throw error when setting an invalid place', () => {
      expect(() => {
        event.place = '';
      }).toThrow('Field place is not valid');
    });
  });

  describe('Success cases', () => {
    it('should create a valid Event instance', () => {
      expect(event).toBeInstanceOf(Event);
      expect(event.id).toBe(baseEventData.id);
      expect(event.creator).toBe(baseEventData.creator);
      expect(event.name).toBe(baseEventData.name);
      expect(event.date).toBe(baseEventData.date);
      expect(event.hour).toBe(baseEventData.hour);
      expect(event.day).toBe(baseEventData.day);
      expect(event.type).toBe(baseEventData.type);
      expect(event.place).toBe(baseEventData.place);
    });

    it('should allow updating event name with a valid value', () => {
      event.name = 'New Event Name';
      expect(event.name).toBe('New Event Name');
    });

    it('should allow updating event type with a valid value', () => {
      event.type = 'New Event Type';
      expect(event.type).toBe('New Event Type');
    });

    it('should allow updating event place with a valid value', () => {
      event.place = 'New Event Place';
      expect(event.place).toBe('New Event Place');
    });
  });
});
