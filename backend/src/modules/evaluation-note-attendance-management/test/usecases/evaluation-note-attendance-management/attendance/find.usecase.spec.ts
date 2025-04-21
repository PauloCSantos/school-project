import FindAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/find.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/attendance.gateway';

const MockRepository = (): jest.Mocked<AttendanceGateway> => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addStudent: jest.fn(),
    removeStudent: jest.fn(),
  };
};

describe('FindAttendance usecase unit test', () => {
  let attendance: Attendance;
  let attendanceRepository: jest.Mocked<AttendanceGateway>;
  let usecase: FindAttendance;

  beforeEach(() => {
    attendance = new Attendance({
      date: new Date(),
      day: 'fri',
      hour: '06:50',
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    });
    attendanceRepository = MockRepository();
    usecase = new FindAttendance(attendanceRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On success', () => {
    it('should find an attendance', async () => {
      attendanceRepository.find.mockResolvedValue(attendance);

      const result = await usecase.execute({ id: attendance.id.value });

      expect(attendanceRepository.find).toHaveBeenCalledWith(
        attendance.id.value
      );
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        id: attendance.id.value,
        date: attendance.date,
        day: attendance.day,
        hour: attendance.hour,
        lesson: attendance.lesson,
        studentsPresent: attendance.studentsPresent,
      });
    });

    it('should return undefined when id is not found', async () => {
      attendanceRepository.find.mockResolvedValue(undefined);

      const result = await usecase.execute({ id: 'non-existent-id' });

      expect(attendanceRepository.find).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeUndefined();
    });
  });
});
