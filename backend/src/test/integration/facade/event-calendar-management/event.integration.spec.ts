import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
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
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: RoleUsersEnum.MASTER,
  };

  it('should create an event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    const result = await facade.create(input, token);

    expect(result.id).toBeDefined();
  });
  it('should find an event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    const result = await facade.create(input, token);
    const Event = await facade.find(result, token);

    expect(Event).toBeDefined();
  });
  it('should find all event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    await facade.create(input, token);
    await facade.create(input2, token);
    await facade.create(input3, token);
    const alls = await facade.findAll({}, token);

    expect(alls.length).toBe(3);
  });
  it('should delete an event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    await facade.create(input, token);
    const id2 = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ id: id2.id }, token);
    //const alls = await facade.findAll({}, token);

    expect(result.message).toBe('Operação concluída com sucesso');
    //expect(alls.length).toBe(2);
  });
  it('should update an  Event using the facade', async () => {
    const facade = EventFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.update(
      {
        id: id.id,
        place: 'Airport',
      },
      token
    );

    expect(result).toBeDefined();
  });
});
