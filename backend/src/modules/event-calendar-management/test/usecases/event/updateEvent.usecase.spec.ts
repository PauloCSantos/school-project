import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UpdateEvent from '@/modules/event-calendar-management/application/usecases/event/updateEvent.usecase';
import Event from '@/modules/event-calendar-management/domain/entity/event.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(event => Promise.resolve(event)),
    delete: jest.fn(),
  };
};

describe('updateEvent usecase unit test', () => {
  const input1 = {
    creator: new Id().id,
    name: 'Christmas',
    date: new Date(),
    hour: '08:00' as Hour,
    day: 'mon' as DayOfWeek,
    type: 'event',
    place: 'school',
  };

  const dataToUpdate = {
    hour: '09:30' as Hour,
    day: 'thu' as DayOfWeek,
    type: 'event',
    place: 'amusement park',
  };

  const event1 = new Event(input1);

  describe('On fail', () => {
    it('should throw an error if the event does not exist', async () => {
      const eventRepository = MockRepository();
      eventRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateEvent(eventRepository);

      await expect(
        usecase.execute({
          ...dataToUpdate,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('Event not found');
    });
  });
  describe('On success', () => {
    it('should update an event', async () => {
      const eventRepository = MockRepository();
      eventRepository.find.mockResolvedValue(event1);
      const usecase = new UpdateEvent(eventRepository);

      const result = await usecase.execute({
        id: event1.id.id,
        ...dataToUpdate,
      });

      expect(eventRepository.update).toHaveBeenCalled();
      expect(eventRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: event1.id.id,
        creator: result.creator,
        name: result.name,
        date: result.date,
        hour: result.hour,
        day: result.day,
        type: result.type,
        place: result.place,
      });
    });
  });
});
