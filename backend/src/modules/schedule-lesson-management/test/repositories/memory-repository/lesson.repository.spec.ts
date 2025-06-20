import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import MemoryLessonRepository from '@/modules/schedule-lesson-management/infrastructure/repositories/memory-repository/lesson.repository';

describe('MemoryLessonRepository unit test', () => {
  let repository: MemoryLessonRepository;

  const name1 = 'Math 01';
  const name2 = 'English 01';
  const name3 = 'Chemistry 01';
  const duration1 = 120;
  const duration2 = 60;
  const duration3 = 180;
  const teacher1 = new Id().value;
  const teacher2 = new Id().value;
  const teacher3 = new Id().value;
  const studentsList1 = [new Id().value, new Id().value];
  const studentsList2 = [new Id().value, new Id().value];
  const studentsList3 = [new Id().value, new Id().value];
  const subject1 = new Id().value;
  const subject2 = new Id().value;
  const subject3 = new Id().value;
  const days1: DayOfWeek[] = ['mon', 'wed'];
  const days2: DayOfWeek[] = ['mon', 'wed'];
  const days3: DayOfWeek[] = ['mon', 'wed'];
  const times1: Hour[] = ['07:00', '08:00'];
  const times2: Hour[] = ['07:00', '08:00'];
  const times3: Hour[] = ['07:00', '08:00'];
  const semester1 = 1;
  const semester2 = 2;
  const semester3 = 1;

  const lesson1 = new Lesson({
    name: name1,
    duration: duration1,
    teacher: teacher1,
    studentsList: studentsList1,
    subject: subject1,
    days: days1,
    times: times1,
    semester: semester1,
  });
  const lesson2 = new Lesson({
    name: name2,
    duration: duration2,
    teacher: teacher2,
    studentsList: studentsList2,
    subject: subject2,
    days: days2,
    times: times2,
    semester: semester2,
  });
  const lesson3 = new Lesson({
    name: name3,
    duration: duration3,
    teacher: teacher3,
    studentsList: studentsList3,
    subject: subject3,
    days: days3,
    times: times3,
    semester: semester3,
  });

  beforeEach(() => {
    repository = new MemoryLessonRepository([lesson1, lesson2]);
  });

  describe('On fail', () => {
    it('should received an null', async () => {
      const lessonId = new Id().value;
      const lessonFound = await repository.find(lessonId);

      expect(lessonFound).toBeNull();
    });
    it('should throw an error when the Id is wrong', async () => {
      const lesson = new Lesson({
        id: new Id(),
        name: name3,
        duration: duration3,
        teacher: teacher3,
        studentsList: studentsList3,
        subject: subject3,
        days: days3,
        times: times3,
        semester: semester3,
      });

      await expect(repository.update(lesson)).rejects.toThrow(
        'Lesson not found'
      );
    });
    it('should generate an error when trying to remove the lesson with the wrong ID', async () => {
      await expect(repository.delete(new Id().value)).rejects.toThrow(
        'Lesson not found'
      );
    });
    it('should generate an error when trying to remove the student from lesson with the wrong lesson ID', async () => {
      await expect(
        repository.removeStudents(new Id().value, [new Id().value])
      ).rejects.toThrow('Lesson not found');
    });
    it('should generate an error when trying to remove the student from lesson with the wrong student ID', async () => {
      await expect(
        repository.removeStudents(lesson1.id.value, [new Id().value])
      ).rejects.toThrow('This student is not included in the lesson');
    });

    it('should generate an error when trying to add the student to the lesson with the wrong student ID', async () => {
      await expect(
        repository.addStudents(lesson1.id.value, ['asdasd'])
      ).rejects.toThrow('Student id is not valid');
    });
  });

  describe('On success', () => {
    it('should find a lesson', async () => {
      const lessonId = lesson1.id.value;
      const lessonFound = await repository.find(lessonId);

      expect(lessonFound).toBeDefined();
      expect(lessonFound!.id).toBeDefined();
      expect(lessonFound!.name).toBe(lesson1.name);
      expect(lessonFound!.duration).toBe(lesson1.duration);
      expect(lessonFound!.teacher).toBe(lesson1.teacher);
      expect(lessonFound!.days).toBe(lesson1.days);
      expect(lessonFound!.studentsList).toBe(lesson1.studentsList);
    });
    it('should create a new lesson and return its id', async () => {
      const result = await repository.create(lesson3);

      expect(result).toBe(lesson3.id.value);
    });
    it('should update a lesson and return its new informations', async () => {
      const updatedLesson: Lesson = lesson2;
      updatedLesson.name = 'Math advanced';

      const result = await repository.update(updatedLesson);

      expect(result).toEqual(updatedLesson);
    });
    it('should find all the lessons', async () => {
      const allLessons = await repository.findAll();

      expect(allLessons.length).toBe(2);
      expect(allLessons[0].name).toBe(lesson1.name);
      expect(allLessons[1].name).toBe(lesson2.name);
      expect(allLessons[0].studentsList).toBe(lesson1.studentsList);
      expect(allLessons[1].studentsList).toBe(lesson2.studentsList);
    });
    it('should remove the lesson', async () => {
      const response = await repository.delete(lesson1.id.value);

      expect(response).toBe('Operação concluída com sucesso');
    });

    it('should add a new student to the lesson', async () => {
      const response = await repository.addStudents(lesson1.id.value, [
        new Id().value,
      ]);

      expect(response).toBe('1 value was entered');
    });
    it('should remove a student from the lesson', async () => {
      const response = await repository.removeStudents(lesson1.id.value, [
        lesson1.studentsList[0],
      ]);

      expect(response).toBe('1 value was removed');
    });

    it('should add a new day to the lesson', async () => {
      const response = await repository.addDay(lesson1.id.value, ['sun']);

      expect(response).toBe('1 value was entered');
    });
    it('should remove a day from the lesson', async () => {
      const response = await repository.removeDay(lesson1.id.value, ['mon']);

      expect(response).toBe('1 value was removed');
    });

    it('should add a new hour to the lesson', async () => {
      const response = await repository.addTime(lesson1.id.value, [
        '10:00',
        '20:00',
      ]);

      expect(response).toBe('2 values were entered');
    });
    it('should remove a hour from the lesson', async () => {
      const response = await repository.removeTime(lesson1.id.value, ['07:00']);

      expect(response).toBe('1 value was removed');
    });
  });
});
