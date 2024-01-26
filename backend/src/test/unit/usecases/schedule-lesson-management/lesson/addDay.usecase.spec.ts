import AddDay from '@/application/usecases/schedule-lesson-management/lesson/addDay.usecase';
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
    addDay: jest.fn((_, newDaysList) =>
      Promise.resolve(
        `${newDaysList.length} ${
          newDaysList.length === 1 ? 'value was' : 'values were'
        } entered`
      )
    ),
    removeDay: jest.fn(),
    addTime: jest.fn(),
    removeTime: jest.fn(),
  };
};

describe('AddDay use case unit test', () => {
  const lesson = new Lesson({
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().id,
    studentsList: [new Id().id, new Id().id, new Id().id],
    subject: new Id().id,
    days: ['mon', 'fri'],
    times: ['15:55', '19:00'],
    semester: 2,
  });
  const input = {
    id: lesson.id.id,
    newDaysList: ['tue'],
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);

      const usecase = new AddDay(lessonRepository);

      await expect(usecase.execute(input)).rejects.toThrow('Lesson not found');
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).not.toHaveBeenCalled();
    });
    it('should throw an error if the day already exists in the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new AddDay(lessonRepository);

      await expect(
        usecase.execute({
          ...input,
          newDaysList: ['mon'],
        })
      ).rejects.toThrow(`Day mon is already added to the lesson`);
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add days to the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new AddDay(lessonRepository);
      const result = await usecase.execute(input);

      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).toHaveBeenCalledWith(
        input.id,
        input.newDaysList
      );
      expect(result.message).toBe(`1 value was entered`);
    });
  });
});
