import Id from '@/modules/@shared/domain/value-object/id.value-object';
import FindEvent from '@/modules/event-calendar-management/application/usecases/event/find.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/calendar.entity';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/calendar.gateway';

// Crie o mock com tipagem explícita
const MockRepository = (): jest.Mocked<EventGateway> => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as jest.Mocked<EventGateway>;
};

describe('FindEvent usecase unit test', () => {
  let input: {
    creator: string;
    name: string;
    date: Date;
    hour: Hour;
    day: DayOfWeek;
    type: string;
    place: string;
  };
  let repository: jest.Mocked<EventGateway>;
  let usecase: FindEvent;
  let event: Event;

  beforeEach(() => {
    input = {
      creator: new Id().value,
      name: 'Christmas',
      date: new Date(),
      hour: '08:00' as Hour,
      day: 'mon' as DayOfWeek,
      type: 'event',
      place: 'school',
    };

    event = new Event(input);
    repository = MockRepository();
    usecase = new FindEvent(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On success', () => {
    it('should find an event when it exists', async () => {
      repository.find.mockResolvedValue(event);

      const result = await usecase.execute({ id: event.id.value });

      expect(repository.find).toHaveBeenCalledWith(event.id.value);
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result).toEqual({
        id: event.id.value,
        creator: event.creator,
        name: event.name,
        date: event.date,
        hour: event.hour,
        day: event.day,
        type: event.type,
        place: event.place,
      });
    });

    it('should return null when id is not found', async () => {
      repository.find.mockResolvedValue(null);
      const notFoundId = '75c791ca-7a40-4217-8b99-2cf22c01d543';

      const result = await usecase.execute({
        id: notFoundId,
      });

      expect(repository.find).toHaveBeenCalledWith(notFoundId);
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });
});
