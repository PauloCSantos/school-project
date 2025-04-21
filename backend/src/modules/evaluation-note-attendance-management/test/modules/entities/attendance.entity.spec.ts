import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

describe('Attendance unit test', () => {
  const baseAttendanceData = {
    lesson: new Id().value,
    date: new Date(),
    hour: '14:30' as Hour,
    day: 'mon' as DayOfWeek,
    studentsPresent: [new Id().value, new Id().value],
  };

  let attendance: Attendance;

  beforeEach(() => {
    attendance = new Attendance({ ...baseAttendanceData });
  });

  describe('Failure cases', () => {
    it('should throw an error when input is missing required fields', () => {
      //@ts-expect-error
      expect(() => new Attendance({})).toThrow(
        'All attendance fields are mandatory'
      );
    });

    it('should throw an error when id is invalid', () => {
      expect(() => {
        new Attendance({ ...baseAttendanceData, id: 'invalid-id' as any });
      }).toThrow('Invalid id');
    });

    it('should throw an error when lesson id is invalid', () => {
      expect(() => {
        new Attendance({ ...baseAttendanceData, lesson: 'invalid-id' });
      }).toThrow('Lesson id is not valid');
    });

    it('should throw an error when date is invalid', () => {
      expect(() => {
        new Attendance({ ...baseAttendanceData, date: 'not-a-date' as any });
      }).toThrow('Date is not up to standard');
    });

    it('should throw an error when hour is invalid', () => {
      expect(() => {
        new Attendance({ ...baseAttendanceData, hour: '25:00' as Hour });
      }).toThrow('Hour is not up to standard');
    });

    it('should throw an error when day is invalid', () => {
      expect(() => {
        new Attendance({
          ...baseAttendanceData,
          day: 'invalidday' as DayOfWeek,
        });
      }).toThrow('Day is not up to standard');
    });

    it('should throw an error when studentsPresent contains invalid ids', () => {
      expect(() => {
        new Attendance({
          ...baseAttendanceData,
          studentsPresent: ['invalid-id'],
        });
      }).toThrow('All student IDs do not follow standards');
    });

    it('should throw an error when studentsPresent contains duplicate ids', () => {
      const sameId = new Id().value;
      expect(() => {
        new Attendance({
          ...baseAttendanceData,
          studentsPresent: [sameId, sameId],
        });
      }).toThrow('All student IDs do not follow standards');
    });

    it('should throw an error when setting an invalid lesson id after creation', () => {
      expect(() => {
        attendance.lesson = 'invalid-id';
      }).toThrow('Lesson id is not valid');
    });

    it('should throw an error when setting an invalid date after creation', () => {
      expect(() => {
        attendance.date = 'invalid-date' as any;
      }).toThrow('Date is not up to standard');
    });

    it('should throw an error when setting an invalid hour after creation', () => {
      expect(() => {
        attendance.hour = '26:30' as Hour;
      }).toThrow('Hour is not up to standard');
    });

    it('should throw an error when setting an invalid day after creation', () => {
      expect(() => {
        attendance.day = 'funday' as DayOfWeek;
      }).toThrow('Day is not up to standard');
    });

    it('should throw an error when adding an invalid student id', () => {
      expect(() => {
        attendance.addStudent('invalid-id');
      }).toThrow('Student id is not valid');
    });

    it('should throw an error when adding a duplicate student', () => {
      const studentId = baseAttendanceData.studentsPresent[0];
      expect(() => {
        attendance.addStudent(studentId);
      }).toThrow('This student is already on the attendance');
    });

    it('should throw an error when removing an invalid student id', () => {
      expect(() => {
        attendance.removeStudent('invalid-id');
      }).toThrow('Student id is not valid');
    });

    it('should throw an error when removing a non-existent student', () => {
      const newStudentId = new Id().value;
      expect(() => {
        attendance.removeStudent(newStudentId);
      }).toThrow('This student is not included in the attendance');
    });
  });

  describe('Success cases', () => {
    it('should create a valid Attendance instance', () => {
      expect(attendance).toBeInstanceOf(Attendance);
      expect(attendance.lesson).toBe(baseAttendanceData.lesson);
      expect(attendance.date).toBe(baseAttendanceData.date);
      expect(attendance.hour).toBe(baseAttendanceData.hour);
      expect(attendance.day).toBe(baseAttendanceData.day);
      expect(attendance.studentsPresent).toEqual(
        baseAttendanceData.studentsPresent
      );
    });

    it('should create an Attendance with a provided id', () => {
      const id = new Id();
      const attendanceWithId = new Attendance({ ...baseAttendanceData, id });

      expect(attendanceWithId.id).toBe(id);
    });

    it('should allow updating lesson with valid id', () => {
      const newLessonId = new Id().value;
      attendance.lesson = newLessonId;
      expect(attendance.lesson).toBe(newLessonId);
    });

    it('should allow updating date with valid date', () => {
      const newDate = new Date('2025-01-15');
      attendance.date = newDate;
      expect(attendance.date).toBe(newDate);
    });

    it('should allow updating hour with valid hour', () => {
      attendance.hour = '09:15' as Hour;
      expect(attendance.hour).toBe('09:15');
    });

    it('should allow updating day with valid day', () => {
      attendance.day = 'fri' as DayOfWeek;
      expect(attendance.day).toBe('fri');
    });

    it('should add a new student successfully', () => {
      const newStudentId = new Id().value;
      const initialLength = attendance.studentsPresent.length;

      attendance.addStudent(newStudentId);

      expect(attendance.studentsPresent.length).toBe(initialLength + 1);
      expect(attendance.studentsPresent).toContain(newStudentId);
    });

    it('should remove a student successfully', () => {
      const studentToRemove = baseAttendanceData.studentsPresent[0];
      const initialLength = attendance.studentsPresent.length;

      attendance.removeStudent(studentToRemove);

      expect(attendance.studentsPresent.length).toBe(initialLength - 1);
      expect(attendance.studentsPresent).not.toContain(studentToRemove);
    });
  });
});
