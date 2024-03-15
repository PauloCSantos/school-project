import MemoryEventRepository from '@/infraestructure/repositories/event-calendar-management/memory-repository/event.repository';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';

describe('MemoryEventRepository unit test', () => {
  let repository: MemoryEventRepository;

  const creator1 = new Id().id;
  const creator2 = new Id().id;
  const creator3 = new Id().id;
  const name1 = 'Event';
  const name2 = 'Party';
  const name3 = 'Graduation';
  const date1 = new Date('05/22/24');
  const date2 = new Date('08/11/24');
  const date3 = new Date('12/04/24');
  const hour1: Hour = '07:00';
  const hour2: Hour = '21:00';
  const hour3: Hour = '14:00';
  const day1: DayOfWeek = 'mon';
  const day2: DayOfWeek = 'sun';
  const day3: DayOfWeek = 'wed';
  const type1 = 'mandatory';
  const type2 = 'not obligatory';
  const type3 = 'mandatory';
  const place1 = 'school';
  const place2 = 'address x';
  const place3 = 'address y';

  const event1 = new Event({
    creator: creator1,
    name: name1,
    date: date1,
    hour: hour1,
    day: day1,
    type: type1,
    place: place1,
  });
  const event2 = new Event({
    creator: creator2,
    name: name2,
    date: date2,
    hour: hour2,
    day: day2,
    type: type2,
    place: place2,
  });
  const event3 = new Event({
    creator: creator3,
    name: name3,
    date: date3,
    hour: hour3,
    day: day3,
    type: type3,
    place: place3,
  });

  beforeEach(() => {
    repository = new MemoryEventRepository([event1, event2]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const eventId = new Id().id;
      const eventFound = await repository.find(eventId);

      expect(eventFound).toBeUndefined();
    });
    it('should throw an error when the Id is wrong', async () => {
      const event = new Event({
        id: new Id(),
        creator: creator3,
        name: name3,
        date: date3,
        hour: hour3,
        day: day3,
        type: type3,
        place: place3,
      });

      await expect(repository.update(event)).rejects.toThrow('Event not found');
    });
    it('should generate an error when trying to remove the event with the wrong ID', async () => {
      await expect(repository.delete(new Id().id)).rejects.toThrow(
        'Event not found'
      );
    });
  });
  describe('On success', () => {
    it('should find a event', async () => {
      const eventId = event1.id.id;
      const eventFound = await repository.find(eventId);

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
      const result = await repository.create(event3);

      expect(result).toBe(event3.id.id);
    });
    it('should update a event and return its new informations', async () => {
      const updatedevent: Event = event2;
      updatedevent.name = 'Happy hour';
      updatedevent.day = 'mon';

      const result = await repository.update(updatedevent);

      expect(result).toEqual(updatedevent);
    });
    it('should find all the event', async () => {
      const allEvents = await repository.findAll();

      expect(allEvents.length).toBe(2);
      expect(allEvents[0].name).toBe(event1.name);
      expect(allEvents[1].name).toBe(event2.name);
      expect(allEvents[0].date).toBe(event1.date);
      expect(allEvents[1].date).toBe(event2.date);
      expect(allEvents[0].creator).toBe(event1.creator);
      expect(allEvents[1].creator).toBe(event2.creator);
    });
    it('should remove the user', async () => {
      const response = await repository.delete(event1.id.id);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
