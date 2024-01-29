import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

describe('Lesson unit test', () => {
  const lessonData = {
    id: new Id(),
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().id,
    studentsList: [new Id().id, new Id().id, new Id().id],
    subject: new Id().id,
    days: ['mon', 'fri'],
    times: ['15:55', '19:00'],
    semester: 2,
  };
  describe('On fail', () => {
    it('should throw error when the input have missing values', () => {
      const lesson = { ...lessonData, name: undefined };
      expect(() => {
        //@ts-expect-error
        new Lesson(lesson);
      }).toThrow('All lesson fields are mandatory');
    });
    it('should throw error when setting an invalid name', () => {
      //@ts-expect-error
      const lesson = new Lesson(lessonData);
      expect(() => {
        lesson.name = '';
      }).toThrow('Field name is not valid');
    });
    it('should throw error when add a student with invalid id', () => {
      //@ts-expect-error
      const lesson = new Lesson(lessonData);
      expect(() => {
        lesson.addStudent('invalidId');
      }).toThrow('Student id is not valid');
    });
    it('should throw error when add a duplicated time', () => {
      //@ts-expect-error
      const lesson = new Lesson(lessonData);
      expect(() => {
        lesson.addTime('19:00');
      }).toThrow('Time 19:00 is already added to the lesson');
    });
  });

  describe('On success', () => {
    it('should create a lesson with valid input', () => {
      //@ts-expect-error
      const lesson = new Lesson(lessonData);

      expect(lesson).toBeDefined();
      expect(lesson.name).toBe(lessonData.name);
      expect(lesson.duration).toBe(lessonData.duration);
      expect(lesson.teacher).toBe(lessonData.teacher);
      expect(lesson.studentList).toEqual(lessonData.studentsList);
      expect(lesson.subject).toBe(lessonData.subject);
      expect(lesson.days).toEqual(lesson.days);
      expect(lesson.times).toEqual(lesson.times);
      expect(lesson.semester).toBe(lesson.semester);
    });
    it('should create a lesson with no students', () => {
      const nLesson = { ...lessonData, studentsList: [] };
      //@ts-expect-error
      const lesson = new Lesson(nLesson);
      expect(lesson).toBeDefined();
      expect(lesson.name).toBe(lessonData.name);
      expect(lesson.duration).toBe(lessonData.duration);
      expect(lesson.teacher).toBe(lessonData.teacher);
      expect(lesson.studentList.length).toBe(0);
      expect(lesson.subject).toBe(lessonData.subject);
      expect(lesson.days).toEqual(lesson.days);
      expect(lesson.times).toEqual(lesson.times);
      expect(lesson.semester).toBe(lesson.semester);
    });
    it('should set a new name', () => {
      //@ts-expect-error
      const lesson = new Lesson(lessonData);

      lesson.name = 'Science';

      expect(lesson.name).toBe('Science');
    });
    it('should set a new duration', () => {
      //@ts-expect-error
      const lesson = new Lesson(lessonData);
      lesson.duration = 90;
      expect(lesson.duration).toBe(90);
    });
    it('should add a new day', () => {
      //@ts-expect-error
      const lesson = new Lesson(lessonData);
      lesson.addDay('tue');
      expect(lesson.days.length).toBe(3);
    });
  });
});
