import FindAllLesson from '@/application/usecases/schedule-lesson-management/lesson/findAllLesson.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lesson from '@/modules/schedule-lesson-management/lesson/domain/entity/lesson.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
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

describe('findAllLesson usecase unit test', () => {
  const lesson1 = new Lesson({
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().id,
    studentsList: [new Id().id, new Id().id, new Id().id],
    subject: new Id().id,
    days: ['mon', 'fri'] as DayOfWeek[],
    times: ['15:55', '19:00'] as Hour[],
    semester: 2 as 1 | 2,
  });
  const lesson2 = new Lesson({
    name: 'Math advanced II',
    duration: 60,
    teacher: new Id().id,
    studentsList: [new Id().id, new Id().id, new Id().id],
    subject: new Id().id,
    days: ['mon', 'fri'] as DayOfWeek[],
    times: ['15:55', '19:00'] as Hour[],
    semester: 2 as 1 | 2,
  });

  describe('On success', () => {
    it('should find all lessons', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.findAll.mockResolvedValue([lesson1, lesson2]);
      const usecase = new FindAllLesson(lessonRepository);

      const result = await usecase.execute({});

      expect(lessonRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllLesson(lessonRepository);

      const result = await usecase.execute({});

      expect(lessonRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
