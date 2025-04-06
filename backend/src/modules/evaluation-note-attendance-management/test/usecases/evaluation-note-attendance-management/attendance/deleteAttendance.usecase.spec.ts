import DeleteAttendance from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/deleteAttendance.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
    addStudent: jest.fn(),
    removeStudent: jest.fn(),
  };
};

describe('deleteAttendance usecase unit test', () => {
  const attendance = new Attendance({
    date: new Date(),
    day: 'fri',
    hour: '06:50',
    lesson: new Id().id,
    studentsPresent: [new Id().id, new Id().id, new Id().id],
  });

  describe('On fail', () => {
    it('should return an error if the attendance does not exist', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteAttendance(attendanceRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('Attendance not found');
    });
  });
  describe('On success', () => {
    it('should delete a attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);
      const usecase = new DeleteAttendance(attendanceRepository);
      const result = await usecase.execute({
        id: attendance.id.id,
      });

      expect(attendanceRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
