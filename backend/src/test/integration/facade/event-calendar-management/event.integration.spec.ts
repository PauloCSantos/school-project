import Id from '@/modules/@shared/domain/value-object/id.value-object';
import EventFacadeFactory from '@/modules/event-calendar-management/application/factory/calendar-facade.factory';

describe('Event facade integration test', () => {
  const input = {
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
    name: 'Party',
    date: new Date(),
    hour: '08:00' as Hour,
    day: 'sun' as DayOfWeek,
    type: 'event',
    place: 'school',
  };
  const input3 = {
    creator: new Id().value,
    name: 'School event',
    date: new Date(),
    hour: '08:00' as Hour,
    day: 'fri' as DayOfWeek,
    type: 'event',
    place: 'school',
  };

  it('should create an event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined();
  });
  it('should find an event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    const result = await facade.create(input);
    const Event = await facade.find(result);

    expect(Event).toBeDefined();
  });
  it('should find all event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    await facade.create(input);
    await facade.create(input2);
    await facade.create(input3);
    const alls = await facade.findAll({});

    expect(alls.length).toBe(3);
  });
  it('should delete an event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    await facade.create(input);
    const id2 = await facade.create(input2);
    await facade.create(input3);
    const result = await facade.delete({ id: id2.id });
    const alls = await facade.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(alls.length).toBe(2);
  });
  it('should update an  Event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.update({
      id: id.id,
      place: 'Airport',
    });

    expect(result).toBeDefined();
  });
});
