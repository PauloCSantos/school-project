import AddStudents from '@/modules/evaluation-note-attendance-management/application/usecases/attendance/add-students.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addStudent: jest.fn((_, newStudentsList) =>
      Promise.resolve(
        `${newStudentsList.length} ${
          newStudentsList.length === 1 ? 'value was' : 'values were'
        } entered`
      )
    ),
    removeStudent: jest.fn(),
  };
};

describe('AddStudents use case unit test', () => {
  const attendance = new Attendance({
    date: new Date(),
    day: 'fri',
    hour: '06:50',
    lesson: new Id().value,
    studentsPresent: [new Id().value, new Id().value, new Id().value],
  });
  const input = {
    id: attendance.id.value,
    newStudentsList: [new Id().value, new Id().value],
  };

  describe('On fail', () => {
    it('should throw an error if the attendance does not exist', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(undefined);

      const usecase = new AddStudents(attendanceRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Attendance not found'
      );
      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.addStudent).not.toHaveBeenCalled();
    });
    it('should throw an error if the student already exists in the attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);

      const usecase = new AddStudents(attendanceRepository);

      await expect(
        usecase.execute({
          ...input,
          newStudentsList: [attendance.studentsPresent[0]],
        })
      ).rejects.toThrow(`This student is already on the attendance`);
      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.addStudent).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add students to the attendance', async () => {
      const attendanceRepository = MockRepository();
      attendanceRepository.find.mockResolvedValue(attendance);

      const usecase = new AddStudents(attendanceRepository);
      const result = await usecase.execute(input);

      expect(attendanceRepository.find).toHaveBeenCalledWith(input.id);
      expect(attendanceRepository.addStudent).toHaveBeenCalledWith(
        input.id,
        input.newStudentsList
      );
      expect(result.message).toBe(`2 values were entered`);
    });
  });
});
