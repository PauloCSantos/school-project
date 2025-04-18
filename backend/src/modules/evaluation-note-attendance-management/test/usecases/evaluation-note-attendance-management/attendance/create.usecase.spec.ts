import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/create.usecase';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(attendance => Promise.resolve(attendance.id.value)),
    update: jest.fn(),
    delete: jest.fn(),
    addStudent: jest.fn(),
    removeStudent: jest.fn(),
  };
};

describe('createAttendance usecase unit test', () => {
  const input = {
    date: new Date(),
    day: 'fri' as DayOfWeek,
    hour: '06:50' as Hour,
    lesson: new Id().value,
    studentsPresent: [new Id().value, new Id().value, new Id().value],
  };
  const attendance = new Attendance(input);

  describe('On fail', () => {
    it('should throw an error if the attendance already exists', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);

      const usecase = new CreateAttendance(attendanceRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Attendance already exists'
      );
      expect(attendanceRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(attendanceRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateAttendance(attendanceRepository);
      const result = await usecase.execute(input);

      expect(attendanceRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(attendanceRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
