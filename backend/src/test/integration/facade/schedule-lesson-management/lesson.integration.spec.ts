import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import LessonFacadeFactory from '@/modules/schedule-lesson-management/application/factory/lesson.factory';

describe('Lesson facade integration test', () => {
  const input = {
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().value,
    studentsList: [new Id().value, new Id().value, new Id().value],
    subject: new Id().value,
    days: ['sun', 'wed'] as DayOfWeek[],
    times: ['15:55', '07:00'] as Hour[],
    semester: 1 as 1 | 2,
  };
  const input2 = {
    name: 'Math advanced II',
    duration: 60,
    teacher: new Id().value,
    studentsList: [new Id().value, new Id().value, new Id().value],
    subject: new Id().value,
    days: ['mon', 'fri'] as DayOfWeek[],
    times: ['15:55', '19:00'] as Hour[],
    semester: 2 as 1 | 2,
  };
  const input3 = {
    name: 'Math advanced III',
    duration: 60,
    teacher: new Id().value,
    studentsList: [new Id().value, new Id().value, new Id().value],
    subject: new Id().value,
    days: ['mon'] as DayOfWeek[],
    times: ['13:00'] as Hour[],
    semester: 2 as 1 | 2,
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: 'master',
  };

  it('should create an Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const result = await facade.create(input, token);

    expect(result.id).toBeDefined();
  });
  it('should find an Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const result = await facade.create(input, token);
    const userLesson = await facade.find(result, token);

    expect(userLesson).toBeDefined();
  });
  it('should find all users Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    await facade.create(input, token);
    await facade.create(input2, token);
    await facade.create(input3, token);
    const allUsers = await facade.findAll({}, token);

    expect(allUsers.length).toBe(3);
  });
  it('should delete an Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    await facade.create(input, token);
    const id2 = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ id: id2.id }, token);
    const allUsers = await facade.findAll({}, token);

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });
  it('should update an Lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.update(
      {
        id: id.id,
        duration: 45,
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should add students to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.addStudents(
      {
        id: id.id,
        newStudentsList: [new Id().value],
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should remove students to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.removeStudents(
      {
        id: id.id,
        studentsListToRemove: [input.studentsList[0]],
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should add day to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.addDay(
      {
        id: id.id,
        newDaysList: ['mon'],
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should remove day to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.removeDay(
      {
        id: id.id,
        daysListToRemove: ['mon'],
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should add time to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.addTime(
      {
        id: id.id,
        newTimesList: ['20:00'],
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should remove time to the lesson using the facade', async () => {
    const facade = LessonFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.removeTime(
      {
        id: id.id,
        timesListToRemove: ['07:00'],
      },
      token
    );

    expect(result).toBeDefined();
  });
});
