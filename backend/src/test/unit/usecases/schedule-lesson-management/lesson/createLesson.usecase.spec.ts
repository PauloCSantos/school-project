import CreateLesson from '@/application/usecases/schedule-lesson-management/lesson/createLesson.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(lesson => Promise.resolve(lesson.id.id)),
    update: jest.fn(),
    delete: jest.fn(),
    addStudents: jest.fn(),
    removeStudents: jest.fn(),
    addDay: jest.fn(),
    removeDay: jest.fn(),
    addTime: jest.fn(),
    removeTime: jest.fn(),
  };
};

describe('createLesson usecase unit test', () => {
  const input = {
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().id,
    studentsList: [new Id().id, new Id().id, new Id().id],
    subject: new Id().id,
    days: ['mon', 'fri'] as DayOfWeek[],
    times: ['15:55', '19:00'] as Hour[],
    semester: 2 as 1 | 2,
  };
  const lesson = new Lesson(input);

  describe('On fail', () => {
    it('should throw an error if the lesson already exists', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new CreateLesson(lessonRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Lesson already exists'
      );
      expect(lessonRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(lessonRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateLesson(lessonRepository);
      const result = await usecase.execute(input);

      expect(lessonRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(lessonRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined;
    });
  });
});
