import RemoveStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/removeStudents.usecase';
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
    removeStudent: jest.fn((_, studentsListToRemove) =>
      Promise.resolve(
        `${studentsListToRemove.length} ${
          studentsListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`
      )
    ),
  };
};

describe('RemoveStudent use case unit test', () => {
  const attendance = new Attendance({
    date: new Date(),
    day: 'fri',
    hour: '06:50',
    lesson: new Id().id,
    studentsPresent: [new Id().id, new Id().id, new Id().id],
  });
  const input = {
    id: attendance.id.id,
    studentsListToRemove: [
      attendance.studentsPresent[0],
      attendance.studentsPresent[1],
    ],
  };

  describe('On fail', () => {
    it('should throw an error if the attendance does not exist', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(undefined);

      const usecase = new RemoveStudents(attendanceRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Attendance not found'
      );
      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.removeStudent).not.toHaveBeenCalled();
    });
    it('should throw an error if the student does not exists in the attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);

      const usecase = new RemoveStudents(attendanceRepository);

      await expect(
        usecase.execute({
          ...input,
          studentsListToRemove: [new Id().id],
        })
      ).rejects.toThrow(`This student is not included in the attendance`);
      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.removeStudent).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove students to the attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);

      const usecase = new RemoveStudents(attendanceRepository);
      const result = await usecase.execute(input);

      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.removeStudent).toHaveBeenCalledWith(
        input.id,
        input.studentsListToRemove
      );
      expect(result.message).toBe(`2 values were removed`);
    });
  });
});
