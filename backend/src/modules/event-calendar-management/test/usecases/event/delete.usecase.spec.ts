import Id from '@/modules/@shared/domain/value-object/id.value-object';
import DeleteEvent from '@/modules/event-calendar-management/application/usecases/event/delete.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/calendar.entity';
import EventGateway from '@/modules/event-calendar-management/infrastructure/gateway/calendar.gateway';

// Crie o mock com tipagem explícita
const MockRepository = (): jest.Mocked<EventGateway> => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn((id: string) =>
      Promise.resolve('Operação concluída com sucesso')
    ),
  } as jest.Mocked<EventGateway>;
};

describe('DeleteEvent usecase unit test', () => {
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
  let usecase: DeleteEvent;
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
    usecase = new DeleteEvent(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On fail', () => {
    it('should throw an error if the event does not exist', async () => {
      repository.find.mockResolvedValue(null);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('Event not found');

      expect(repository.find).toHaveBeenCalledWith(
        '75c791ca-7a40-4217-8b99-2cf22c01d543'
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should delete an event', async () => {
      repository.find.mockResolvedValue(event);

      const result = await usecase.execute({
        id: event.id.value,
      });

      expect(repository.find).toHaveBeenCalledWith(event.id.value);
      expect(repository.delete).toHaveBeenCalledWith(event.id.value);
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
