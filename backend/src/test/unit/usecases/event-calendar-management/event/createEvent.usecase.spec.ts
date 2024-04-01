import CreateEvent from '@/application/usecases/event-calendar-management/event/createEvent.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(event => Promise.resolve(event.id.id)),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createEvent usecase unit test', () => {
  const input = {
    creator: new Id().id,
    name: 'Christmas',
    date: new Date(),
    hour: '08:00' as Hour,
    day: 'mon' as DayOfWeek,
    type: 'event',
    place: 'school',
  };

  const event = new Event(input);

  describe('On fail', () => {
    it('should throw an error if the event already exists', async () => {
      const eventRepository = MockRepository();
      eventRepository.find.mockResolvedValue(event);

      const usecase = new CreateEvent(eventRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Event already exists'
      );
      expect(eventRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(eventRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a event', async () => {
      const eventRepository = MockRepository();
      eventRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateEvent(eventRepository);
      const result = await usecase.execute(input);

      expect(eventRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(eventRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
