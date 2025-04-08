import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateEvent from '../../application/usecases/event/create.usecase';
import FindEvent from '../../application/usecases/event/find.usecase';
import FindAllEvent from '../../application/usecases/event/find-all.usecase';
import UpdateEvent from '../../application/usecases/event/update.usecase';
import DeleteEvent from '../../application/usecases/event/delete.usecase';
import { EventController } from '../../interface/controller/calendar.controller';

describe('EventController unit test', () => {
  const mockCreateEvent = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateEvent;
  });
  const mockFindEvent = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        creator: 'dfcd1710-de67-45f4-9ba1-6a07cc66609f',
        name: 'Christmas',
        date: '2024-02-09T11:40:50.095Z',
        hour: '08:00',
        day: 'mon',
        type: 'event',
        place: 'school',
      }),
    } as unknown as FindEvent;
  });
  const mockFindAllEvent = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue([
        {
          creator: 'dfcd1710-de67-45f4-9ba1-6a07cc66609f',
          name: 'Christmas',
          date: '2024-02-09T11:40:50.095Z',
          hour: '08:00',
          day: 'mon',
          type: 'event',
          place: 'school',
        },
        {
          creator: 'dfcd1710-de67-45f4-9ba1-6a07cc66609f',
          name: 'Holiday',
          date: '2024-02-09T11:40:50.095Z',
          hour: '17:00',
          day: 'fri',
          type: 'event',
          place: 'school',
        },
      ]),
    } as unknown as FindAllEvent;
  });
  const mockUpdateEvent = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        creator: 'dfcd1710-de67-45f4-9ba1-6a07cc66609f',
        name: 'Christmas',
        date: '2024-02-09T11:40:50.095Z',
        hour: '08:00',
        day: 'mon',
        type: 'event',
        place: 'school',
      }),
    } as unknown as UpdateEvent;
  });
  const mockDeleteEvent = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteEvent;
  });

  const createEvent = mockCreateEvent();
  const deleteEvent = mockDeleteEvent();
  const findAllEvent = mockFindAllEvent();
  const findEvent = mockFindEvent();
  const updateEvent = mockUpdateEvent();

  const controller = new EventController(
    createEvent,
    findEvent,
    findAllEvent,
    updateEvent,
    deleteEvent
  );

  it('should return a id for the new event created', async () => {
    const result = await controller.create({
      creator: new Id().value,
      name: 'Christmas',
      date: new Date(),
      hour: '08:00' as Hour,
      day: 'mon' as DayOfWeek,
      type: 'event',
      place: 'school',
    });

    expect(result).toBeDefined();
    expect(createEvent.execute).toHaveBeenCalled();
  });
  it('should return a event', async () => {
    const result = await controller.find({ id: new Id().value });

    expect(result).toBeDefined();
    expect(findEvent.execute).toHaveBeenCalled();
  });
  it('should return all events', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllEvent.execute).toHaveBeenCalled();
  });
  it('should update an event', async () => {
    const result = await controller.update({
      id: new Id().value,
      name: 'Holiday',
    });

    expect(result).toBeDefined();
    expect(updateEvent.execute).toHaveBeenCalled();
  });
  it('should delete an event', async () => {
    const result = await controller.delete({
      id: new Id().value,
    });

    expect(result).toBeDefined();
    expect(deleteEvent.execute).toHaveBeenCalled();
  });
});
