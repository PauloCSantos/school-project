import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import ScheduleFacadeFactory from '@/modules/schedule-lesson-management/application/factory/schedule.factory';

describe('Schedule facade integration test', () => {
  const input = {
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  };
  const input2 = {
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  };
  const input3 = {
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: RoleUsersEnum.MASTER,
  };

  it('should create an Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const result = await facade.create(input, token);

    expect(result.id).toBeDefined();
  });
  it('should find an Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const result = await facade.create(input, token);
    const userSchedule = await facade.find(result, token);

    expect(userSchedule).toBeDefined();
  });
  it('should find all users Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    await facade.create(input, token);
    await facade.create(input2, token);
    await facade.create(input3, token);
    const allUsers = await facade.findAll({}, token);

    expect(allUsers.length).toBe(3);
  });
  it('should delete an Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    await facade.create(input, token);
    const id2 = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ id: id2.id }, token);
    const allUsers = await facade.findAll({}, token);

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });
  it('should update an Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.update(
      {
        id: id.id,
        curriculum: new Id().value,
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should add lessons to the Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.addLessons(
      {
        id: id.id,
        newLessonsList: [new Id().value],
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should remove lessons to the Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.removeLessons(
      {
        id: id.id,
        lessonsListToRemove: [input.lessonsList[0]],
      },
      token
    );

    expect(result).toBeDefined();
  });
});
