import FindAllAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/findAllAttendance.usecase';
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

describe('findAllAttendance usecase unit test', () => {
  const attendance1 = new Attendance({
    date: new Date(),
    day: 'fri',
    hour: '06:50',
    lesson: new Id().id,
    studentsPresent: [new Id().id, new Id().id, new Id().id],
  });
  const attendance2 = new Attendance({
    date: new Date(),
    day: 'sat',
    hour: '13:50',
    lesson: new Id().id,
    studentsPresent: [new Id().id, new Id().id, new Id().id],
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
    });
  });
});
