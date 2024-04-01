import MemoryAttendanceRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/attendance.repository';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

describe('MemoryAttendanceRepository unit test', () => {
  let repository: MemoryAttendanceRepository;

  const lesson1 = new Id().id;
  const lesson2 = new Id().id;
  const lesson3 = new Id().id;
  const date1 = new Date();
  const date2 = new Date();
  const date3 = new Date();
  const hour1: Hour = '07:00';
  const hour2: Hour = '12:00';
  const hour3: Hour = '19:00';
  const day1: DayOfWeek = 'fri';
  const day2: DayOfWeek = 'mon';
  const day3: DayOfWeek = 'wed';
  const studentsPresent1 = [new Id().id, new Id().id, new Id().id];
  const studentsPresent2 = [new Id().id, new Id().id, new Id().id];
  const studentsPresent3 = [new Id().id, new Id().id, new Id().id];

  const attendance1 = new Attendance({
    lesson: lesson1,
    date: date1,
    hour: hour1,
    day: day1,
    studentsPresent: studentsPresent1,
  });
  const attendance2 = new Attendance({
    lesson: lesson2,
    date: date2,
    hour: hour2,
    day: day2,
    studentsPresent: studentsPresent2,
  });
  const attendance3 = new Attendance({
    lesson: lesson3,
    date: date3,
    hour: hour3,
    day: day3,
    studentsPresent: studentsPresent3,
  });

  beforeEach(() => {
    repository = new MemoryAttendanceRepository([attendance1, attendance2]);
  });

  describe('On fail', () => {
    it('should received an undefined', async () => {
      const attendanceId = new Id().id;
      const attendanceFound = await repository.find(attendanceId);
      expect(attendanceFound).toBeUndefined();
    });
    it('should throw an error when the Id is wrong', async () => {
      const attendance = new Attendance({
        id: new Id(),
        lesson: lesson3,
        date: date3,
        hour: hour3,
        day: day3,
        studentsPresent: studentsPresent3,
      });

      await expect(repository.update(attendance)).rejects.toThrow(
        'Attendance not found'
      );
    });
    it('should generate an error when trying to remove the attendance with the wrong ID', async () => {
      await expect(repository.delete(new Id().id)).rejects.toThrow(
        'Attendance not found'
      );
    });
    it('should generate an error when trying to remove the student from attendance with the wrong attendance ID', async () => {
      await expect(
        repository.removeStudent(new Id().id, [new Id().id])
      ).rejects.toThrow('Attendance not found');
    });
    it('should generate an error when trying to remove the student from attendance with the wrong student ID', async () => {
      await expect(
        repository.removeStudent(attendance1.id.id, [new Id().id])
      ).rejects.toThrow('This student is not included in the attendance');
    });

    it('should generate an error when trying to add the student to the attendance with the wrong student ID', async () => {
      await expect(
        repository.addStudent(attendance1.id.id, ['asdasd'])
      ).rejects.toThrow('Student id is not valid');
    });
  });

  describe('On success', () => {
    it('should find a attendance', async () => {
      const attendanceId = attendance1.id.id;
      const attendanceFound = await repository.find(attendanceId);

      expect(attendanceFound).toBeDefined();
      expect(attendanceFound!.id).toBeDefined();
      expect(attendanceFound!.lesson).toBe(attendance1.lesson);
      expect(attendanceFound!.date).toBe(attendance1.date);
      expect(attendanceFound!.hour).toBe(attendance1.hour);
      expect(attendanceFound!.day).toBe(attendance1.day);
      expect(attendanceFound!.studentsPresent).toBe(
        attendance1.studentsPresent
      );
    });
    it('should create a new attendance and return its id', async () => {
      const result = await repository.create(attendance3);

      expect(result).toBe(attendance3.id.id);
    });
    it('should update a attendance and return its new informations', async () => {
      const updatedAttendance: Attendance = attendance2;
      updatedAttendance.hour = '14:00';

      const result = await repository.update(updatedAttendance);

      expect(result).toEqual(updatedAttendance);
    });
    it('should find all the attendances', async () => {
      const allAttendances = await repository.findAll();

      expect(allAttendances.length).toBe(2);
      expect(allAttendances[0].lesson).toBe(attendance1.lesson);
      expect(allAttendances[1].lesson).toBe(attendance2.lesson);
      expect(allAttendances[0].hour).toBe(attendance1.hour);
      expect(allAttendances[1].hour).toBe(attendance2.hour);
      expect(allAttendances[0].studentsPresent).toBe(
        attendance1.studentsPresent
      );
      expect(allAttendances[1].studentsPresent).toBe(
        attendance2.studentsPresent
      );
    });
    it('should remove the attendance', async () => {
      const response = await repository.delete(attendance1.id.id);

      expect(response).toBe('Operação concluída com sucesso');
    });

    it('should add a new student to the attendance', async () => {
      const response = await repository.addStudent(attendance1.id.id, [
        new Id().id,
        new Id().id,
      ]);

      expect(response).toBe('2 values were entered');
    });
    it('should remove a student from the attendance', async () => {
      const response = await repository.removeStudent(attendance1.id.id, [
        attendance1.studentsPresent[0],
      ]);

      expect(response).toBe('1 value was removed');
    });
  });
});
