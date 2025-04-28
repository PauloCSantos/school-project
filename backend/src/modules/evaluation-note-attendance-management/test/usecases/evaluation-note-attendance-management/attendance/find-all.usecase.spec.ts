import FindAllAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/find-all.usecase';
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

describe('FindAllAttendance usecase unit test', () => {
  let attendance1: Attendance;
  let attendance2: Attendance;

  beforeEach(() => {
    attendance1 = new Attendance({
      date: new Date(),
      day: 'fri',
      hour: '06:50',
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    });
    attendance2 = new Attendance({
      date: new Date(),
      day: 'sat',
      hour: '13:50',
      lesson: new Id().value,
      studentsPresent: [new Id().value, new Id().value, new Id().value],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('On success', () => {
    it('should find all attendances', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.findAll.mockResolvedValue([
        attendance1,
        attendance2,
      ]);
      const usecase = new FindAllAttendance(attendanceRepository);

      const result = await usecase.execute({});

      expect(attendanceRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });

    it('should return an empty array when the repository is empty', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllAttendance(attendanceRepository);

      const result = await usecase.execute({});

      expect(attendanceRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });
  });

  describe('On fail', () => {
    it('should throw an error if repository.findAll fails', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.findAll.mockRejectedValueOnce(
        new Error('Database error')
      );
      const usecase = new FindAllAttendance(attendanceRepository);

      await expect(usecase.execute({})).rejects.toThrow('Database error');
      expect(attendanceRepository.findAll).toHaveBeenCalled();
    });
  });
});
