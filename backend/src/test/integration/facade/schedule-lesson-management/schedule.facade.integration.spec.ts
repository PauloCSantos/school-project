import Id from '@/modules/@shared/domain/value-object/id.value-object';
import ScheduleFacadeFactory from '@/modules/schedule-lesson-management/application/factory/schedule-facade.factory';

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

  it('should create an Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined();
  });
  it('should find an Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const result = await facade.create(input);
    const userSchedule = await facade.find(result);

    expect(userSchedule).toBeDefined();
  });
  it('should find all users Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    await facade.create(input);
    await facade.create(input2);
    await facade.create(input3);
    const allUsers = await facade.findAll({});

    expect(allUsers.length).toBe(3);
  });
  it('should delete an Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    await facade.create(input);
    const id2 = await facade.create(input2);
    await facade.create(input3);
    const result = await facade.delete({ id: id2.id });
    const allUsers = await facade.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });
  it('should update an Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.update({
      id: id.id,
      curriculum: new Id().value,
    });

    expect(result).toBeDefined();
  });
  it('should add lessons to the Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.addLessons({
      id: id.id,
      newLessonsList: [new Id().value],
    });

    expect(result).toBeDefined();
  });
  it('should remove lessons to the Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.removeLessons({
      id: id.id,
      lessonsListToRemove: [input.lessonsList[0]],
    });

    expect(result).toBeDefined();
  });
});
