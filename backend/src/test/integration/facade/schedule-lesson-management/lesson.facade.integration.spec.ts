import LessonFacadeFactory from '@/application/factory/schedule-lesson-management/lesson-facade.factory';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('Lesson facade integration test', () => {
  const input = {
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().id,
    studentsList: [new Id().id, new Id().id, new Id().id],
    subject: new Id().id,
    days: ['sun', 'wed'] as DayOfWeek[],
    times: ['15:55', '07:00'] as Hour[],
    semester: 1 as 1 | 2,
  };
  const input2 = {
    name: 'Math advanced II',
    duration: 60,
    teacher: new Id().id,
    studentsList: [new Id().id, new Id().id, new Id().id],
    subject: new Id().id,
    days: ['mon', 'fri'] as DayOfWeek[],
    times: ['15:55', '19:00'] as Hour[],
    semester: 2 as 1 | 2,
  };
  const input3 = {
    name: 'Math advanced III',
    duration: 60,
    teacher: new Id().id,
    studentsList: [new Id().id, new Id().id, new Id().id],
    subject: new Id().id,
    days: ['mon'] as DayOfWeek[],
    times: ['13:00'] as Hour[],
    semester: 2 as 1 | 2,
  };

  it('should create an Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const result = await facade.create(input);

    expect(result.id).toBeDefined();
  });
  it('should find an Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const result = await facade.create(input);
    const userLesson = await facade.find(result);

    expect(userLesson).toBeDefined();
  });
  it('should find all users Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    await facade.create(input);
    await facade.create(input2);
    await facade.create(input3);
    const allUsers = await facade.findAll({});

    expect(allUsers.length).toBe(3);
  });
  it('should delete an Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    await facade.create(input);
    const id2 = await facade.create(input2);
    await facade.create(input3);
    const result = await facade.delete({ id: id2.id });
    const allUsers = await facade.findAll({});

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });
  it('should update an Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.update({
      id: id.id,
      duration: 45,
    });

    expect(result).toBeDefined();
  });
  it('should add students to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.addStudents({
      id: id.id,
      newStudentsList: [new Id().id],
    });

    expect(result).toBeDefined();
  });
  it('should remove students to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.removeStudents({
      id: id.id,
      studentsListToRemove: [input.studentsList[0]],
    });

    expect(result).toBeDefined();
  });
  it('should add day to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.addDay({
      id: id.id,
      newDaysList: ['mon'],
    });

    expect(result).toBeDefined();
  });
  it('should remove day to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.removeDay({
      id: id.id,
      daysListToRemove: ['mon'],
    });

    expect(result).toBeDefined();
  });
  it('should add time to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.addTime({
      id: id.id,
      newTimesList: ['20:00'],
    });

    expect(result).toBeDefined();
  });
  it('should remove time to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input);

    const result = await facade.removeTime({
      id: id.id,
      timesListToRemove: ['07:00'],
    });

    expect(result).toBeDefined();
  });
});
