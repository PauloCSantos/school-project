import CreateSchedule from '../../application/usecases/schedule/create.usecase';
import DeleteSchedule from '../../application/usecases/schedule/delete.usecase';
import FindAllSchedule from '../../application/usecases/schedule/find-all.usecase';
import FindSchedule from '../../application/usecases/schedule/find.usecase';
import RemoveLessons from '../../application/usecases/schedule/remove-lessons.usecase';
import UpdateSchedule from '../../application/usecases/schedule/update.usecase';

import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AddLessons from '../../application/usecases/schedule/add-lessons.usecase';
import { ScheduleController } from '../../interface/controller/schedule.controller';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('ScheduleController unit test', () => {
  let token: TokenData;

  const mockCreateSchedule = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateSchedule;
  });
  const mockFindSchedule = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        student: 'fcb7a16f-5108-460d-9154-8f973a61dc93',
        curriculum: 'e6ca1138-2f37-4057-8bba-41f9d263318f',
        lessonsList: [
          '84859123-575c-417f-95b8-33514f25bf57',
          '1889c4d6-4a11-4f84-bc14-e27a208bab14',
          '33b60d7e-af4f-462b-a966-3ee8eefe4d00',
        ],
      }),
    } as unknown as FindSchedule;
  });
  const mockFindAllSchedule = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue([
        {
          student: new Id().value,
          curriculum: new Id().value,
          lessonsList: [new Id().value, new Id().value, new Id().value],
        },
        {
          student: new Id().value,
          curriculum: new Id().value,
          lessonsList: [new Id().value, new Id().value, new Id().value],
        },
      ]),
    } as unknown as FindAllSchedule;
  });
  const mockUpdateSchedule = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        student: new Id().value,
        curriculum: new Id().value,
      }),
    } as unknown as UpdateSchedule;
  });
  const mockDeleteSchedule = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteSchedule;
  });
  const mockAddLessons = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({ message: '1 value was entered' }),
    } as unknown as AddLessons;
  });
  const mockRemoveLessons = jest.fn(() => {
    return {
      execute: jest
        .fn()
        .mockResolvedValue({ message: '2 values were removed' }),
    } as unknown as RemoveLessons;
  });

  token = {
    email: 'caller@domain.com',
    role: RoleUsersEnum.MASTER,
    masterId: new Id().value,
  };

  const createSchedule = mockCreateSchedule();
  const deleteSchedule = mockDeleteSchedule();
  const findAllSchedule = mockFindAllSchedule();
  const findSchedule = mockFindSchedule();
  const updateSchedule = mockUpdateSchedule();
  const addLessons = mockAddLessons();
  const removeLessons = mockRemoveLessons();

  const controller = new ScheduleController(
    createSchedule,
    findSchedule,
    findAllSchedule,
    updateSchedule,
    deleteSchedule,
    addLessons,
    removeLessons
  );

  it('should return a id for the new schedule created', async () => {
    const result = await controller.create(
      {
        student: 'fcb7a16f-5108-460d-9154-8f973a61dc93',
        curriculum: 'e6ca1138-2f37-4057-8bba-41f9d263318f',
        lessonsList: [
          '84859123-575c-417f-95b8-33514f25bf57',
          '1889c4d6-4a11-4f84-bc14-e27a208bab14',
          '33b60d7e-af4f-462b-a966-3ee8eefe4d00',
        ],
      },
      token
    );

    expect(result).toBeDefined();
    expect(createSchedule.execute).toHaveBeenCalled();
  });
  it('should return a schedule', async () => {
    const result = await controller.find({ id: new Id().value }, token);

    expect(result).toBeDefined();
    expect(findSchedule.execute).toHaveBeenCalled();
  });
  it('should return all schedules', async () => {
    const result = await controller.findAll({}, token);

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllSchedule.execute).toHaveBeenCalled();
  });
  it('should update a schedule', async () => {
    const result = await controller.update(
      {
        id: new Id().value,
        curriculum: new Id().value,
      },
      token
    );

    expect(result).toBeDefined();
    expect(updateSchedule.execute).toHaveBeenCalled();
  });
  it('should delete a schedule', async () => {
    const result = await controller.delete(
      {
        id: new Id().value,
      },
      token
    );

    expect(result).toBeDefined();
    expect(deleteSchedule.execute).toHaveBeenCalled();
  });
  it('should add a subject to the schedule', async () => {
    const result = await controller.addLessons(
      {
        id: new Id().value,
        newLessonsList: [new Id().value],
      },
      token
    );

    expect(result).toBeDefined();
    expect(addLessons.execute).toHaveBeenCalled();
  });
  it('should remove a subject from the schedule', async () => {
    const result = await controller.removeLessons(
      {
        id: new Id().value,
        lessonsListToRemove: [new Id().value, new Id().value],
      },
      token
    );

    expect(result).toBeDefined();
    expect(removeLessons.execute).toHaveBeenCalled();
  });
});
