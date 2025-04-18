import AddStudents from '../../application/usecases/attendance/add-students.usecase';
import CreateAttendance from '../../application/usecases/attendance/create.usecase';
import DeleteAttendance from '../../application/usecases/attendance/delete.usecase';
import FindAllAttendance from '../../application/usecases/attendance/find-all.usecase';
import FindAttendance from '../../application/usecases/attendance/find.usecase';
import RemoveStudents from '../../application/usecases/attendance/remove-students.usecase';
import UpdateAttendance from '../../application/usecases/attendance/update.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { AttendanceController } from '../../interface/controller/attendance.controller';

describe('AttendanceController unit test', () => {
  const mockCreateAttendance = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue(new Id().value),
    } as unknown as CreateAttendance;
  });
  const mockFindAttendance = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        lesson: '96c6335d-0c22-401e-8ccd-682130b70e1a',
        date: '2024-02-09T11:51:05.079Z',
        hour: '06:50',
        day: 'fri',
        studentsPresent: [
          '615e11af-01bf-48a7-8ae4-efcc8c160b45',
          '73a07eaf-36e5-4f4b-9a40-64c65fa0e6b6',
          'c5567af5-ad54-4d5d-81a4-51ffa1611d99',
        ],
      }),
    } as unknown as FindAttendance;
  });
  const mockFindAllAttendance = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue([
        {
          lesson: '96c6335d-0c22-401e-8ccd-682130b70e1a',
          date: '2024-02-09T11:51:05.079Z',
          hour: '06:50',
          day: 'fri',
          studentsPresent: [
            '615e11af-01bf-48a7-8ae4-efcc8c160b45',
            '73a07eaf-36e5-4f4b-9a40-64c65fa0e6b6',
            'c5567af5-ad54-4d5d-81a4-51ffa1611d99',
          ],
        },
        {
          lesson: '84c6335d-0c22-401e-8ccd-682130b70e1a',
          date: '2024-03-09T11:51:05.079Z',
          hour: '20:00',
          day: 'mon',
          studentsPresent: [
            '615e11af-01bf-48a7-8ae4-efcc8c160b45',
            '73a07eaf-36e5-4f4b-9a40-64c65fa0e6b6',
            'c5567af5-ad54-4d5d-81a4-51ffa1611d99',
          ],
        },
      ]),
    } as unknown as FindAllAttendance;
  });
  const mockUpdateAttendance = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        lesson: '96c6335d-0c22-401e-8ccd-682130b70e1a',
        date: '2024-02-09T11:51:05.079Z',
        hour: '06:50',
        day: 'fri',
        studentsPresent: [
          '615e11af-01bf-48a7-8ae4-efcc8c160b45',
          '73a07eaf-36e5-4f4b-9a40-64c65fa0e6b6',
          'c5567af5-ad54-4d5d-81a4-51ffa1611d99',
        ],
      }),
    } as unknown as UpdateAttendance;
  });
  const mockDeleteAttendance = jest.fn(() => {
    return {
      execute: jest.fn().mockResolvedValue({
        message: 'Operação concluída com sucesso',
      }),
    } as unknown as DeleteAttendance;
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

  const createAttendance = mockCreateAttendance();
  const deleteAttendance = mockDeleteAttendance();
  const findAllAttendance = mockFindAllAttendance();
  const findAttendance = mockFindAttendance();
  const updateAttendance = mockUpdateAttendance();
  const addStudents = mockAddStudents();
  const removeStudents = mockRemoveStudents();

  const controller = new AttendanceController(
    createAttendance,
    findAttendance,
    findAllAttendance,
    updateAttendance,
    deleteAttendance,
    addStudents,
    removeStudents
  );

  it('should return a id for the new attendance created', async () => {
    const result = await controller.create({
      date: new Date(),
      day: 'fri' as DayOfWeek,
      hour: '06:50' as Hour,
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    });

    expect(result).toBeDefined();
    expect(createAttendance.execute).toHaveBeenCalled();
  });
  it('should return a attendance', async () => {
    const result = await controller.find({ id: new Id().value });

    expect(result).toBeDefined();
    expect(findAttendance.execute).toHaveBeenCalled();
  });
  it('should return all attendances', async () => {
    const result = await controller.findAll({});

    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(findAllAttendance.execute).toHaveBeenCalled();
  });
  it('should update a attendance', async () => {
    const result = await controller.update({
      id: new Id().value,
      hour: '14:00',
    });

    expect(result).toBeDefined();
    expect(updateAttendance.execute).toHaveBeenCalled();
  });
  it('should delete a attendance', async () => {
    const result = await controller.delete({
      id: new Id().value,
    });

    expect(result).toBeDefined();
    expect(deleteAttendance.execute).toHaveBeenCalled();
  });
  it('should add students to the attendance', async () => {
    const result = await controller.addStudents({
      id: new Id().value,
      newStudentsList: [new Id().value],
    });

    expect(result).toBeDefined();
    expect(addStudents.execute).toHaveBeenCalled();
  });
  it('should remove students from the attendance', async () => {
    const result = await controller.removeStudents({
      id: new Id().value,
      studentsListToRemove: [new Id().value, new Id().value],
    });

    expect(result).toBeDefined();
    expect(removeStudents.execute).toHaveBeenCalled();
  });
});
