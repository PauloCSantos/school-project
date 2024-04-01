import AddLessons from '@/application/usecases/schedule-lesson-management/schedule/addLessons.usecase';
import CreateSchedule from '@/application/usecases/schedule-lesson-management/schedule/createSchedule.usecase';
import DeleteSchedule from '@/application/usecases/schedule-lesson-management/schedule/deleteSchedule.usecase';
import FindAllSchedule from '@/application/usecases/schedule-lesson-management/schedule/findAllSchedule.usecase';
import FindSchedule from '@/application/usecases/schedule-lesson-management/schedule/findSchedule.usecase';
import RemoveLessons from '@/application/usecases/schedule-lesson-management/schedule/removeLessons.usecase';
import UpdateSchedule from '@/application/usecases/schedule-lesson-management/schedule/updateSchedule.usecase';
import { ScheduleController } from '@/interface/controller/schedule-lesson-management/schedule.controller';
import Id from '@/modules/@shared/domain/value-object/id.value-object';

describe('ScheduleController unit test', () => {
  const mockCreateSchedule = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().id),
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
          student: new Id().id,
          curriculum: new Id().id,
          lessonsList: [new Id().id, new Id().id, new Id().id],
        },
        {
          student: new Id().id,
          curriculum: new Id().id,
          lessonsList: [new Id().id, new Id().id, new Id().id],
        },
      ]),
    } as unknown as FindAllSchedule;
  });
  const mockUpdateSchedule = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        student: new Id().id,
        curriculum: new Id().id,
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
    const result = await controller.create({
      student: 'fcb7a16f-5108-460d-9154-8f973a61dc93',
      curriculum: 'e6ca1138-2f37-4057-8bba-41f9d263318f',
      lessonsList: [
        '84859123-575c-417f-95b8-33514f25bf57',
        '1889c4d6-4a11-4f84-bc14-e27a208bab14',
        '33b60d7e-af4f-462b-a966-3ee8eefe4d00',
      ],
    });

    expect(result).toBeDefined();
    expect(createSchedule.execute).toHaveBeenCalled();
  });
  it('should return a schedule', async () => {
    const result = await controller.find(new Id());

    expect(result).toBeDefined();
    expect(findSchedule.execute).toHaveBeenCalled();
  });
  it('should return all schedules', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllSchedule.execute).toHaveBeenCalled();
  });
  it('should update a schedule', async () => {
    const result = await controller.update({
      id: new Id().id,
      curriculum: new Id().id,
    });

    expect(result).toBeDefined();
    expect(updateSchedule.execute).toHaveBeenCalled();
  });
  it('should delete a schedule', async () => {
    const result = await controller.delete({
      id: new Id().id,
    });

    expect(result).toBeDefined();
    expect(deleteSchedule.execute).toHaveBeenCalled();
  });
  it('should add a subject to the schedule', async () => {
    const result = await controller.addLessons({
      id: new Id().id,
      newLessonsList: [new Id().id],
    });

    expect(result).toBeDefined();
    expect(addLessons.execute).toHaveBeenCalled();
  });
  it('should remove a subject from the schedule', async () => {
    const result = await controller.removeLessons({
      id: new Id().id,
      lessonsListToRemove: [new Id().id, new Id().id],
    });

    expect(result).toBeDefined();
    expect(removeLessons.execute).toHaveBeenCalled();
  });
});
