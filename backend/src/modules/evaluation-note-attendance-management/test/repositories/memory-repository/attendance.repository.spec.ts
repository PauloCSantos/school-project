import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import { AttendanceMapper } from '@/modules/evaluation-note-attendance-management/infrastructure/mapper/attendance.mapper';
import MemoryAttendanceRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/attendance.repository';

describe('MemoryAttendanceRepository unit test', () => {
  let repository: MemoryAttendanceRepository;
  let attendance1: Attendance;
  let attendance2: Attendance;
  let attendance3: Attendance;
  const masterId = new Id().value;
  const lesson1 = new Id().value;
  const lesson2 = new Id().value;
  const lesson3 = new Id().value;
  const date1 = new Date();
  const date2 = new Date();
  const date3 = new Date();
  const hour1: Hour = '07:00';
  const hour2: Hour = '12:00';
  const hour3: Hour = '19:00';
  const day1: DayOfWeek = 'fri';
  const day2: DayOfWeek = 'mon';
  const day3: DayOfWeek = 'wed';
  const studentsPresent1 = [new Id().value, new Id().value, new Id().value];
  const studentsPresent2 = [new Id().value, new Id().value, new Id().value];
  const studentsPresent3 = [new Id().value, new Id().value, new Id().value];

  beforeEach(() => {
    attendance1 = new Attendance({
      lesson: lesson1,
      date: date1,
      hour: hour1,
      day: day1,
      studentsPresent: studentsPresent1,
    });
    attendance2 = new Attendance({
      lesson: lesson2,
      date: date2,
      hour: hour2,
      day: day2,
      studentsPresent: studentsPresent2,
    });
    attendance3 = new Attendance({
      lesson: lesson2,
      date: date2,
      hour: hour2,
      day: day2,
      studentsPresent: studentsPresent3,
    });
    repository = new MemoryAttendanceRepository([
      {
        masterId,
        records: [attendance1, attendance2],
      },
    ]);
  });

  describe('On fail', () => {
    it('should return null if attendance not found', async () => {
      const attendanceId = new Id().value;
      const attendanceFound = await repository.find(masterId, attendanceId);
      expect(attendanceFound).toBeNull();
    });

    it('should throw an error when trying to update a non-existent attendance', async () => {
      const nonExistentId = new Id().value;
      const attendance = new Attendance({
        id: new Id(nonExistentId),
        lesson: lesson3,
        date: date3,
        hour: hour3,
        day: day3,
        studentsPresent: studentsPresent3,
      });

      await expect(repository.update(masterId, attendance)).rejects.toThrow(
        'Attendance not found'
      );
    });

    it('should throw an error when trying to delete a non-existent attendance', async () => {
      const nonExistentId = new Id().value;

      await expect(repository.delete(masterId, nonExistentId)).rejects.toThrow(
        'Attendance not found'
      );
    });
  });

  describe('On success', () => {
    it('should find an existing attendance by id', async () => {
      const attendanceId = attendance1.id.value;
      const attendanceFound = await repository.find(masterId, attendanceId);

      expect(attendanceFound).toBeDefined();
      expect(attendanceFound!.id.value).toBe(attendance1.id.value);
      expect(attendanceFound!.lesson).toBe(attendance1.lesson);
      expect(attendanceFound!.date).toBe(attendance1.date);
      expect(attendanceFound!.hour).toBe(attendance1.hour);
      expect(attendanceFound!.day).toBe(attendance1.day);
      expect(attendanceFound!.studentsPresent).toBe(
        attendance1.studentsPresent
      );
    });

    it('should create a new attendance and return its id', async () => {
      const result = await repository.create(masterId, attendance3);

      expect(result).toBe(attendance3.id.value);

      // Verify attendance was added to repository
      const attendanceFound = await repository.find(
        masterId,
        attendance3.id.value
      );
      expect(attendanceFound).toBeDefined();
      expect(attendanceFound!.lesson).toBe(attendance3.lesson);
      expect(attendanceFound!.hour).toBe(attendance3.hour);
      expect(attendanceFound!.day).toBe(attendance3.day);

      // Verify repository state
      const allAttendances = await repository.findAll(masterId);
      expect(allAttendances.length).toBe(3);
    });

    it('should update an existing attendance and persist changes', async () => {
      const updatedAttendance = new Attendance({
        id: attendance2.id,
        lesson: lesson2,
        date: date2,
        hour: '14:30', // Changed from '12:00'
        day: 'tue', // Changed from 'mon'
        studentsPresent: studentsPresent2,
      });

      const result = await repository.update(masterId, updatedAttendance);

      expect(result).toEqual(updatedAttendance);

      // Verify changes were persisted
      const persisted = await repository.find(masterId, attendance2.id.value);
      expect(persisted).toBeDefined();
      expect(persisted!.hour).toBe('14:30');
      expect(persisted!.day).toBe('tue');
      expect(persisted!.lesson).toBe(lesson2);
    });

    it('should find all the attendances', async () => {
      const allAttendances = await repository.findAll(masterId);

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

    it('should delete an existing attendance and update repository state', async () => {
      const response = await repository.delete(masterId, attendance1.id.value);

      expect(response).toBe('Operação concluída com sucesso');

      // Verify attendance was removed from repository
      const deletedAttendance = await repository.find(
        masterId,
        attendance1.id.value
      );
      expect(deletedAttendance).toBeNull();

      // Verify repository state
      const allAttendances = await repository.findAll(masterId);
      expect(allAttendances.length).toBe(1);
      expect(allAttendances[0].id.value).toBe(attendance2.id.value);
    });

    it('should add new students to the attendance and persist changes', async () => {
      const newStudents = [new Id().value, new Id().value];
      const attendanceObj = AttendanceMapper.toObj(attendance1);
      const updatedAttendance = new Attendance({
        ...attendanceObj,
        id: new Id(attendanceObj.id),
        hour: attendanceObj.hour as Hour,
        day: attendanceObj.day as DayOfWeek,
        studentsPresent: [...attendanceObj.studentsPresent],
      });
      newStudents.forEach(student => {
        updatedAttendance.addStudent(student);
      });
      const response = await repository.addStudent(
        masterId,
        attendance1.id.value,
        updatedAttendance
      );

      expect(response).toBe('2 values were entered');

      // Verify students were added to the attendance
      const updated = await repository.find(masterId, attendance1.id.value);
      expect(updated!.studentsPresent.length).toBe(
        updatedAttendance.studentsPresent.length
      );
      expect(updated!.studentsPresent).toContain(newStudents[0]);
      expect(updated!.studentsPresent).toContain(newStudents[1]);
    });

    it('should remove students from the attendance and persist changes', async () => {
      const attendance = await repository.find(masterId, attendance1.id.value);
      const attendanceObj = AttendanceMapper.toObj(attendance!);
      const updatedAttendance = new Attendance({
        ...attendanceObj,
        id: new Id(attendanceObj.id),
        hour: attendanceObj.hour as Hour,
        day: attendanceObj.day as DayOfWeek,
        studentsPresent: [...attendanceObj.studentsPresent],
      });
      const studentToRemove = attendance?.studentsPresent[0];
      updatedAttendance.removeStudent(studentToRemove!);

      const response = await repository.removeStudent(
        masterId,
        attendance1.id.value,
        updatedAttendance
      );
      expect(response).toBe('1 value was removed');

      const updated = await repository.find(masterId, attendance1.id.value);
      expect(updated!.studentsPresent.length).toBe(
        updatedAttendance!.studentsPresent.length
      );
      expect(updated!.studentsPresent.includes(studentToRemove!)).toBe(false);
    });
  });
});
