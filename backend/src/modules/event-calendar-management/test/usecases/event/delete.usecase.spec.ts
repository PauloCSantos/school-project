import Id from '@/modules/@shared/domain/value-object/id.value-object';
import DeleteEvent from '@/modules/event-calendar-management/application/usecases/event/delete.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/calendar.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
  };
};

describe('deleteEvent usecase unit test', () => {
  const input = {
    creator: new Id().value,
    name: 'Christmas',
    date: new Date(),
    hour: '08:00' as Hour,
    day: 'mon' as DayOfWeek,
    type: 'event',
    place: 'school',
  };

  const event = new Event(input);

  describe('On fail', () => {
    it('should return an error if the event does not exist', async () => {
      const eventRepository = MockRepository();
      eventRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteEvent(eventRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('Event not found');
    });
  });
  describe('On success', () => {
    it('should delete a event', async () => {
      const eventRepository = MockRepository();
      eventRepository.find.mockResolvedValue(event);
      const usecase = new DeleteEvent(eventRepository);
      const result = await usecase.execute({
        id: event.id.value,
      });

      expect(eventRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
