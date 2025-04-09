import FindAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/find.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

const MockRepository = () => {
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

describe('findAttendance usecase unit test', () => {
  const attendance1 = new Attendance({
    date: new Date(),
    day: 'fri',
    hour: '06:50',
    lesson: new Id().value,
    studentsPresent: [new Id().value, new Id().value, new Id().value],
  });

  describe('On success', () => {
    it('should find a attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance1);
      const usecase = new FindAttendance(attendanceRepository);

      const result = await usecase.execute({ id: attendance1.id.value });

      expect(attendanceRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(undefined);

      const usecase = new FindAttendance(attendanceRepository);
      const result = await usecase.execute({
        id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
      });

      expect(result).toBe(undefined);
    });
  });
});
