import ScheduleFacadeFactory from '@/application/factory/schedule-lesson-management/schedule-facade.factory';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('Schedule facade integration test', () => {
  const input = {
    student: new Id().id,
    curriculum: new Id().id,
    lessonsList: [new Id().id, new Id().id, new Id().id],
  };
  const input2 = {
    student: new Id().id,
    curriculum: new Id().id,
    lessonsList: [new Id().id, new Id().id, new Id().id],
  };
  const input3 = {
    student: new Id().id,
    curriculum: new Id().id,
    lessonsList: [new Id().id, new Id().id, new Id().id],
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
      curriculum: new Id().id,
    });

    expect(result).toBeDefined();
  });
  it('should add lessons to the Schedule using the facade', async () => {
    const facade = ScheduleFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.addLessons({
      id: id.id,
      newLessonsList: [new Id().id],
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
