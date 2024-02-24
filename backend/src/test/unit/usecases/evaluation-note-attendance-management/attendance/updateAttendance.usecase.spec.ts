import UpdateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/updateAttendance.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(attendance => Promise.resolve(attendance)),
    delete: jest.fn(),
    addStudent: jest.fn(),
    removeStudent: jest.fn(),
  };
};

describe('updateAttendance usecase unit test', () => {
  const attendance = new Attendance({
    date: new Date(),
    day: 'fri',
    hour: '06:50',
    lesson: new Id().id,
    studentsPresent: [new Id().id, new Id().id, new Id().id],
  });
  const input = {
    id: attendance.id.id,
    day: 'thu' as DayOfWeek,
    hour: '13:40' as Hour,
  };

  describe('On fail', () => {
    it('should throw an error if the attendance does not exist', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateAttendance(attendanceRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('Attendance not found');
    });
  });
  describe('On success', () => {
    it('should update a attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);
      const usecase = new UpdateAttendance(attendanceRepository);

      const result = await usecase.execute(input);

      expect(attendanceRepository.update).toHaveBeenCalled();
      expect(attendanceRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: attendance.id.id,
        date: result.date,
        day: result.day,
        hour: result.hour,
        lesson: result.lesson,
      });
    });
  });
});
