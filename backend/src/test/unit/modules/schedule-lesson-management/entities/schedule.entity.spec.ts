import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

describe('Schedule unit test', () => {
  const student = new Id().id;
  const curriculum = new Id().id;
  const lesson1 = new Id().id;
  const lesson2 = new Id().id;
  const lesson3 = new Id().id;

  const scheduleProps = {
    id: new Id(),
    student,
    curriculum,
    lessonsList: [lesson1, lesson2],
  };

  describe('On fail', () => {
    it('should throw an error if mandatory fields are missing', () => {
      //@ts-expect-error
      expect(() => new Schedule({})).toThrow(
        'All schedule fields are mandatory'
      );
    });
    it('should throw an error if the curriculum ID is not valid', () => {
      const invalidInput = {
        student,
        curriculum: 'InvalidID',
        lessonsList: [lesson1, lesson2],
      };

      expect(() => new Schedule(invalidInput)).toThrow(
        'Curriculum id is not valid'
      );
    });
    it('should throw an error if the student ID is not valid', () => {
      const invalidInput = {
        student: 'InvalidID',
        curriculum,
        lessonsList: [lesson1, lesson2],
      };
      expect(() => new Schedule(invalidInput)).toThrow(
        'Student id is not valid'
      );
    });
    it('should throw an error if lessons list contains invalid IDs', () => {
      const invalidInput = {
        student,
        curriculum,
        lessonsList: [lesson1, lesson2, 'invalidId'],
      };
      expect(() => new Schedule(invalidInput)).toThrow(
        'lessons list have an invalid id'
      );
    });
    it('should throw an error when adding an invalid lesson', () => {
      const schedule = new Schedule(scheduleProps);

      expect(() => schedule.addLesson('InvalidID')).toThrow(
        'Lesson id is not valid'
      );
    });
    it('should throw an error when removing a non-existent lesson', () => {
      const schedule = new Schedule(scheduleProps);

      expect(() => schedule.removeLesson(new Id().id)).toThrow(
        'This lesson is not included in the schedule'
      );
    });
  });
  describe('On success', () => {
    it('should create a new Schedule instance', () => {
      const schedule = new Schedule(scheduleProps);

      expect(schedule).toBeInstanceOf(Schedule);
      expect(schedule.student).toBe(scheduleProps.student);
      expect(schedule.curriculum).toBe(scheduleProps.curriculum);
      expect(schedule.lessonsList).toEqual(scheduleProps.lessonsList);
    });
    it('should add a lesson to the lessons list', () => {
      const schedule = new Schedule(scheduleProps);
      schedule.addLesson(lesson3);

      expect(schedule.lessonsList).toEqual([lesson1, lesson2, lesson3]);
    });
    it('should remove a lesson from the lessons list', () => {
      const schedule = new Schedule(scheduleProps);
      schedule.removeLesson(lesson2);

      expect(schedule.lessonsList).toEqual([lesson1, lesson3]);
    });
  });
});
