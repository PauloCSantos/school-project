import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

describe('Attendance unit test', () => {
  const attendanceData = {
    lesson: new Id().id,
    date: new Date('2024-01-12'),
    hour: '14:00',
    day: 'mon',
    studentsPresent: [new Id().id, new Id().id, new Id().id],
  };

  describe('On fail', () => {
    it('should throw error when the input have missing values', () => {
      expect(() => {
        //@ts-expect-error
        new Attendance({});
      }).toThrow('All attendance fields are mandatory');
    });
    it('should throw error when setting invalid lesson', () => {
      //@ts-expect-error
      const attendanceInstance = new Attendance(attendanceData);

      expect(() => {
        attendanceInstance.lesson = '';
      }).toThrow('Lesson id is not valid');
    });
    it('should throw error when setting invalid day', () => {
      //@ts-expect-error
      const attendanceInstance = new Attendance(attendanceData);

      expect(() => {
        //@ts-expect-error
        attendanceInstance.day = 'InvalidDay';
      }).toThrow('Day are not up to standard');
    });
    it('should thorow error when setting invalid hour', () => {
      //@ts-expect-error
      const attendanceInstance = new Attendance(attendanceData);

      expect(() => {
        attendanceInstance.hour = '25:00';
      }).toThrow('Hour is not up to standard');
    });
    it('should throw error when setting invalid date', () => {
      //@ts-expect-error
      const attendanceInstance = new Attendance(attendanceData);

      expect(() => {
        //@ts-expect-error
        attendanceInstance.date = 'InvalidDate';
      }).toThrow('Date is not up to standard');
    });

    it('should throw error when removing non-existent student', () => {
      //@ts-expect-error
      const attendanceInstance = new Attendance(attendanceData);
      const studentId = new Id().id;

      expect(() => {
        attendanceInstance.removeStudent(studentId);
      }).toThrow('This student is not included in the attendance');
    });
  });

  describe('On success', () => {
    it('should create a valid attendance', () => {
      //@ts-expect-error
      const attendanceInstance = new Attendance(attendanceData);

      expect(attendanceInstance).toBeInstanceOf(Attendance);
      expect(attendanceInstance.id).toBeDefined();
      expect(attendanceInstance.lesson).toBe(attendanceData.lesson);
      expect(attendanceInstance.date).toEqual(attendanceData.date);
      expect(attendanceInstance.hour).toBe(attendanceData.hour);
      expect(attendanceInstance.day).toBe(attendanceData.day);
      expect(attendanceInstance.studentsPresent).toEqual(
        attendanceData.studentsPresent
      );
    });

    it('should add and remove students successfully', () => {
      //@ts-expect-error
      const attendanceInstance = new Attendance(attendanceData);
      const newStudentId = new Id().id;
      attendanceInstance.addStudent(newStudentId);
      expect(attendanceInstance.studentsPresent).toContain(newStudentId);

      attendanceInstance.removeStudent(newStudentId);
      expect(attendanceInstance.studentsPresent).not.toContain(newStudentId);
    });
  });
});
