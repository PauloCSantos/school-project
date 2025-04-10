import Id from '@/modules/@shared/domain/value-object/id.value-object';
import FindEvent from '@/modules/event-calendar-management/application/usecases/event/find.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/calendar.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findEvent usecase unit test', () => {
  const input1 = {
    creator: new Id().value,
    name: 'Christmas',
    date: new Date(),
    hour: '08:00' as Hour,
    day: 'mon' as DayOfWeek,
    type: 'event',
    place: 'school',
  };

  const event1 = new Event(input1);

  describe('On success', () => {
    it('should find an event', async () => {
      const eventRepository = MockRepository();
      eventRepository.find.mockResolvedValue(event1);
      const usecase = new FindEvent(eventRepository);

      const result = await usecase.execute({ id: event1.id.value });

      expect(eventRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const eventRepository = MockRepository();
      eventRepository.find.mockResolvedValue(undefined);

      const usecase = new FindEvent(eventRepository);
      const result = await usecase.execute({
        id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
      });

      expect(result).toBe(undefined);
    });
  });
});
