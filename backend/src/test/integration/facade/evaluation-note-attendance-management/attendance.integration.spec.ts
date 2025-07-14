import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import AttendanceFacadeFactory from '@/modules/evaluation-note-attendance-management/application/factory/attendance.factory';

describe('Attendance facade integration test', () => {
  const input = {
    date: new Date(),
    day: 'fri' as DayOfWeek,
    hour: '06:50' as Hour,
    lesson: new Id().value,
    studentsPresent: [new Id().value, new Id().value, new Id().value],
  };
  const input2 = {
    date: new Date(),
    day: 'fri' as DayOfWeek,
    hour: '06:50' as Hour,
    lesson: new Id().value,
    studentsPresent: [new Id().value, new Id().value, new Id().value],
  };
  const input3 = {
    date: new Date(),
    day: 'fri' as DayOfWeek,
    hour: '06:50' as Hour,
    lesson: new Id().value,
    studentsPresent: [new Id().value, new Id().value, new Id().value],
  };
  const token: TokenData = {
    email: 'teste@teste.com.br',
    masterId: 'validID',
    role: 'master',
  };

  it('should create an attendance using the facade', async () => {
    const facade = AttendanceFacadeFactory.create();
    const result = await facade.create(input, token);

    expect(result.id).toBeDefined();
  });
  it('should find an attendance using the facade', async () => {
    const facade = AttendanceFacadeFactory.create();
    const result = await facade.create(input, token);
    const userAttendance = await facade.find(result, token);

    expect(userAttendance).toBeDefined();
  });
  it('should find all attendance using the facade', async () => {
    const facade = AttendanceFacadeFactory.create();
    await facade.create(input, token);
    await facade.create(input2, token);
    await facade.create(input3, token);
    const allUsers = await facade.findAll({}, token);

    expect(allUsers.length).toBe(3);
  });
  it('should delete an attendance using the facade', async () => {
    const facade = AttendanceFacadeFactory.create();
    await facade.create(input, token);
    const id2 = await facade.create(input2, token);
    await facade.create(input3, token);
    const result = await facade.delete({ id: id2.id }, token);
    const allUsers = await facade.findAll({}, token);

    expect(result.message).toBe('Operação concluída com sucesso');
    expect(allUsers.length).toBe(2);
  });
  it('should update an attendance using the facade', async () => {
    const facade = AttendanceFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.update(
      {
        id: id.id,
        lesson: new Id().value,
      },
      token
    );

    expect(result).toBeDefined();
  });
  it('should add students to the attendance using the facade', async () => {
    const facade = AttendanceFacadeFactory.create();
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
  it('should remove students to the attendance using the facade', async () => {
    const facade = AttendanceFacadeFactory.create();
    const id = await facade.create(input, token);

    const result = await facade.removeStudents(
      {
        id: id.id,
        studentsListToRemove: [input.studentsPresent[0]],
      },
      token
    );

    expect(result).toBeDefined();
  });
});
