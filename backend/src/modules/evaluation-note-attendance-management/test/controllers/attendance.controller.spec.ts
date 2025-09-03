import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AddStudents from '../../application/usecases/attendance/add-students.usecase';
import CreateAttendance from '../../application/usecases/attendance/create.usecase';
import DeleteAttendance from '../../application/usecases/attendance/delete.usecase';
import FindAllAttendance from '../../application/usecases/attendance/find-all.usecase';
import FindAttendance from '../../application/usecases/attendance/find.usecase';
import RemoveStudents from '../../application/usecases/attendance/remove-students.usecase';
import UpdateAttendance from '../../application/usecases/attendance/update.usecase';
import AttendanceController from '../../interface/controller/attendance.controller';
import { UpdateAttendanceInputDto } from '../../application/dto/attendance-usecase.dto';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('AttendanceController unit test', () => {
  let token: TokenData;

  const mockCreateAttendance: jest.Mocked<CreateAttendance> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<CreateAttendance>;

  const mockFindAttendance: jest.Mocked<FindAttendance> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<FindAttendance>;

  const mockFindAllAttendance: jest.Mocked<FindAllAttendance> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<FindAllAttendance>;

  const mockUpdateAttendance: jest.Mocked<UpdateAttendance> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<UpdateAttendance>;

  const mockDeleteAttendance: jest.Mocked<DeleteAttendance> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<DeleteAttendance>;

  const mockAddStudents: jest.Mocked<AddStudents> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<AddStudents>;

  const mockRemoveStudents: jest.Mocked<RemoveStudents> = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<RemoveStudents>;

  let controller: AttendanceController;
  const id = new Id().value;

  const attendanceData = {
    id: id,
    lesson: '96c6335d-0c22-401e-8ccd-682130b70e1a',
    date: new Date('2024-02-09T11:51:05.079Z'),
    hour: '06:50',
    day: 'fri',
    studentsPresent: [
      '615e11af-01bf-48a7-8ae4-efcc8c160b45',
      '73a07eaf-36e5-4f4b-9a40-64c65fa0e6b6',
      'c5567af5-ad54-4d5d-81a4-51ffa1611d99',
    ],
  };

  const createOutput = { id: id };
  token = {
    email: 'caller@domain.com',
    role: RoleUsersEnum.MASTER,
    masterId: new Id().value,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateAttendance.execute.mockResolvedValue(createOutput);
    mockFindAttendance.execute.mockResolvedValue(attendanceData);
    mockFindAllAttendance.execute.mockResolvedValue([
      attendanceData,
      {
        ...attendanceData,
        id: new Id().value,
        lesson: '84c6335d-0c22-401e-8ccd-682130b70e1a',
        date: new Date('2024-02-09T11:51:05.079Z'),
        hour: '20:00',
        day: 'mon',
      },
    ]);
    mockUpdateAttendance.execute.mockResolvedValue(attendanceData);
    mockDeleteAttendance.execute.mockResolvedValue({
      message: 'Operation completed successfully',
    });
    mockAddStudents.execute.mockResolvedValue({
      message: '1 value was entered',
    });
    mockRemoveStudents.execute.mockResolvedValue({
      message: '2 values were removed',
    });

    controller = new AttendanceController(
      mockCreateAttendance,
      mockFindAttendance,
      mockFindAllAttendance,
      mockUpdateAttendance,
      mockDeleteAttendance,
      mockAddStudents,
      mockRemoveStudents
    );
  });

  it('should return a id for the new attendance created', async () => {
    const createInput = {
      date: new Date(),
      day: 'fri' as DayOfWeek,
      hour: '06:50' as Hour,
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    };

    const result = await controller.create(createInput, token);

    expect(mockCreateAttendance.execute).toHaveBeenCalledTimes(1);
    expect(mockCreateAttendance.execute).toHaveBeenCalledWith(createInput, token);
    expect(result).toBeDefined();
    expect(result).toEqual(createOutput);
  });

  it('should return a attendance', async () => {
    const findInput = { id };
    const result = await controller.find(findInput, token);

    expect(mockFindAttendance.execute).toHaveBeenCalledTimes(1);
    expect(mockFindAttendance.execute).toHaveBeenCalledWith(findInput, token);
    expect(result).toEqual(attendanceData);
  });

  it('should return all attendances', async () => {
    const findAllInput = {};
    const result = await controller.findAll(findAllInput, token);

    expect(mockFindAllAttendance.execute).toHaveBeenCalledTimes(1);
    expect(mockFindAllAttendance.execute).toHaveBeenCalledWith(findAllInput, token);
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
  });

  it('should update a attendance', async () => {
    const updateInput: UpdateAttendanceInputDto = {
      id,
      hour: '14:00',
    };
    const result = await controller.update(updateInput, token);

    expect(mockUpdateAttendance.execute).toHaveBeenCalledTimes(1);
    expect(mockUpdateAttendance.execute).toHaveBeenCalledWith(updateInput, token);
    expect(result).toEqual(attendanceData);
  });

  it('should delete a attendance', async () => {
    const deleteInput = { id };
    const result = await controller.delete(deleteInput, token);

    expect(mockDeleteAttendance.execute).toHaveBeenCalledTimes(1);
    expect(mockDeleteAttendance.execute).toHaveBeenCalledWith(deleteInput, token);
    expect(result).toEqual({ message: 'Operation completed successfully' });
  });

  it('should add students to the attendance', async () => {
    const addStudentsInput = {
      id,
      newStudentsList: [new Id().value],
    };
    const result = await controller.addStudents(addStudentsInput, token);

    expect(mockAddStudents.execute).toHaveBeenCalledTimes(1);
    expect(mockAddStudents.execute).toHaveBeenCalledWith(addStudentsInput, token);
    expect(result).toEqual({ message: '1 value was entered' });
  });

  it('should remove students from the attendance', async () => {
    const removeStudentsInput = {
      id,
      studentsListToRemove: [new Id().value, new Id().value],
    };
    const result = await controller.removeStudents(removeStudentsInput, token);

    expect(mockRemoveStudents.execute).toHaveBeenCalledTimes(1);
    expect(mockRemoveStudents.execute).toHaveBeenCalledWith(removeStudentsInput, token);
    expect(result).toEqual({ message: '2 values were removed' });
  });
});
