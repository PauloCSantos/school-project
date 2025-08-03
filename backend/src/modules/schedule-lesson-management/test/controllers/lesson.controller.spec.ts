import AddStudents from '../../application/usecases/lesson/add-students.usecase';
import AddTime from '../../application/usecases/lesson/add-time.usecase';
import CreateLesson from '../../application/usecases/lesson/create.usecase';
import DeleteLesson from '../../application/usecases/lesson/delete.usecase';
import FindAllLesson from '../../application/usecases/lesson/find-all.usecase';
import FindLesson from '../../application/usecases/lesson/find.usecase';
import RemoveDay from '../../application/usecases/lesson/remove-day.usecase';
import RemoveStudents from '../../application/usecases/lesson/remove-students.usecase';
import RemoveTime from '../../application/usecases/lesson/remove-time.usecase';
import UpdateLesson from '../../application/usecases/lesson/update.usecase';

import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AddDay from '../../application/usecases/lesson/add-day.usecase';
import { LessonController } from '../../interface/controller/lesson.controller';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('LessonController unit test', () => {
  let token: TokenData;

  const mockCreateLesson = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateLesson;
  });
  const mockFindLesson = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        name: 'Math advanced I',
        duration: 60,
        teacher: 'e39e7dcb-0cf3-4068-ae8a-7d4097fb826a',
        studentsList: [
          '2cfd59b3-87c0-480a-848d-5f8370013d93',
          '85ee08d8-fa40-4fd4-9f0a-fb60462fba17',
          '76dbc5d5-ef7e-491d-a247-d171d53dc443',
        ],
        subject: 'a9178b3b-0398-4a03-8888-7bc1056e5ac0',
        days: ['mon', 'fri'],
        times: ['15:55', '19:00'],
        semester: 2,
      }),
    } as unknown as FindLesson;
  });
  const mockFindAllLesson = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue([
        {
          name: 'Math advanced I',
          duration: 60,
          teacher: 'e39e7dcb-0cf3-4068-ae8a-7d4097fb826a',
          studentsList: [
            '2cfd59b3-87c0-480a-848d-5f8370013d93',
            '85ee08d8-fa40-4fd4-9f0a-fb60462fba17',
            '76dbc5d5-ef7e-491d-a247-d171d53dc443',
          ],
          subject: 'a9178b3b-0398-4a03-8888-7bc1056e5ac0',
          days: ['mon', 'fri'],
          times: ['15:55', '19:00'],
          semester: 2,
        },
        {
          name: 'Math advanced II',
          duration: 60,
          teacher: new Id().value,
          studentsList: [new Id().value, new Id().value],
          subject: new Id().value,
          days: ['mon', 'fri'],
          times: ['15:55', '19:00'],
          semester: 2,
        },
      ]),
    } as unknown as FindAllLesson;
  });
  const mockUpdateLesson = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        name: 'Math advanced II',
        duration: 60,
        teacher: new Id().value,
        subject: new Id().value,
        semester: 2,
      }),
    } as unknown as UpdateLesson;
  });
  const mockDeleteLesson = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteLesson;
  });
  const mockAddStudents = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({ message: '1 value was entered' }),
    } as unknown as AddStudents;
  });
  const mockRemoveStudents = jest.fn(() => {
    return {
      execute: jest
        .fn()
        .mockResolvedValue({ message: '2 values were removed' }),
    } as unknown as RemoveStudents;
  });
  const mockAddDay = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({ message: '1 value was entered' }),
    } as unknown as AddDay;
  });
  const mockRemoveDay = jest.fn(() => {
    return {
      execute: jest
        .fn()
        .mockResolvedValue({ message: '2 values were removed' }),
    } as unknown as RemoveDay;
  });
  const mockAddTime = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({ message: '1 value was entered' }),
    } as unknown as AddTime;
  });
  const mockRemoveTime = jest.fn(() => {
    return {
      execute: jest
        .fn()
        .mockResolvedValue({ message: '2 values were removed' }),
    } as unknown as RemoveTime;
  });
  token = {
    email: 'caller@domain.com',
    role: RoleUsersEnum.MASTER,
    masterId: new Id().value,
  };

  const createLesson = mockCreateLesson();
  const deleteLesson = mockDeleteLesson();
  const findAllLesson = mockFindAllLesson();
  const findLesson = mockFindLesson();
  const updateLesson = mockUpdateLesson();
  const addStudents = mockAddStudents();
  const removeStudents = mockRemoveStudents();
  const addDay = mockAddDay();
  const removeDay = mockRemoveDay();
  const addTime = mockAddTime();
  const removeTime = mockRemoveTime();

  const controller = new LessonController(
    createLesson,
    findLesson,
    findAllLesson,
    updateLesson,
    deleteLesson,
    addStudents,
    removeStudents,
    addDay,
    removeDay,
    addTime,
    removeTime
  );

  it('should return a id for the new lesson created', async () => {
    const result = await controller.create(
      {
        name: 'Math advanced I',
        duration: 60,
        teacher: new Id().value,
        studentsList: [new Id().value, new Id().value, new Id().value],
        subject: new Id().value,
        days: ['mon', 'fri'],
        times: ['15:55', '19:00'],
        semester: 2,
      },
      token
    );

    expect(result).toBeDefined();
    expect(createLesson.execute).toHaveBeenCalled();
  });
  it('should return a lesson', async () => {
    const result = await controller.find({ id: new Id().value }, token);

    expect(result).toBeDefined();
    expect(findLesson.execute).toHaveBeenCalled();
  });
  it('should return all lessons', async () => {
    const result = await controller.findAll({}, token);

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllLesson.execute).toHaveBeenCalled();
  });
  it('should update a lesson', async () => {
    const result = await controller.update(
      {
        id: new Id().value,
        semester: 1,
      },
      token
    );

    expect(result).toBeDefined();
    expect(updateLesson.execute).toHaveBeenCalled();
  });
  it('should delete a lesson', async () => {
    const result = await controller.delete(
      {
        id: new Id().value,
      },
      token
    );

    expect(result).toBeDefined();
    expect(deleteLesson.execute).toHaveBeenCalled();
  });
  it('should add students to the curriculum', async () => {
    const result = await controller.addStudents(
      {
        id: new Id().value,
        newStudentsList: [new Id().value],
      },
      token
    );

    expect(result).toBeDefined();
    expect(addStudents.execute).toHaveBeenCalled();
  });
  it('should remove students from the curriculum', async () => {
    const result = await controller.removeStudents(
      {
        id: new Id().value,
        studentsListToRemove: [new Id().value, new Id().value],
      },
      token
    );

    expect(result).toBeDefined();
    expect(removeStudents.execute).toHaveBeenCalled();
  });

  it('should add day to the curriculum', async () => {
    const result = await controller.addDay(
      {
        id: new Id().value,
        newDaysList: ['wed'],
      },
      token
    );

    expect(result).toBeDefined();
    expect(addDay.execute).toHaveBeenCalled();
  });
  it('should remove day from the curriculum', async () => {
    const result = await controller.removeDay(
      {
        id: new Id().value,
        daysListToRemove: ['mon', 'fri'],
      },
      token
    );

    expect(result).toBeDefined();
    expect(removeDay.execute).toHaveBeenCalled();
  });

  it('should add time to the curriculum', async () => {
    const result = await controller.addTime(
      {
        id: new Id().value,
        newTimesList: ['20:00'],
      },
      token
    );

    expect(result).toBeDefined();
    expect(addTime.execute).toHaveBeenCalled();
  });
  it('should remove time from the curriculum', async () => {
    const result = await controller.removeTime(
      {
        id: new Id().value,
        timesListToRemove: ['15:55', '19:00'],
      },
      token
    );

    expect(result).toBeDefined();
    expect(removeTime.execute).toHaveBeenCalled();
  });
});
