import Id from '@/modules/@shared/domain/value-object/id.value-object';
import FindAllEvent from '@/modules/event-calendar-management/application/usecases/event/findAllEvent.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findAllEvent usecase unit test', () => {
  const input1 = {
    creator: new Id().value,
    name: 'Christmas',
    date: new Date(),
    hour: '08:00' as Hour,
    day: 'mon' as DayOfWeek,
    type: 'event',
    place: 'school',
  };
  const input2 = {
    creator: new Id().value,
    name: 'Summer',
    date: new Date(),
    hour: '14:00' as Hour,
    day: 'fri' as DayOfWeek,
    type: 'event',
    place: 'school',
  };

  const event1 = new Event(input1);
  const event2 = new Event(input2);

  describe('On success', () => {
    it('should find all events', async () => {
      const eventRepository = MockRepository();
      eventRepository.findAll.mockResolvedValue([event1, event2]);
      const usecase = new FindAllEvent(eventRepository);

      const result = await usecase.execute({});

      expect(eventRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const eventRepository = MockRepository();
      eventRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllEvent(eventRepository);

      const result = await usecase.execute({});

      expect(eventRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
