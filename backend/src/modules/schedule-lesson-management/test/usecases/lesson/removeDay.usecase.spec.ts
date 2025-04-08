import Id from '@/modules/@shared/domain/value-object/id.value-object';
import RemoveDay from '@/modules/schedule-lesson-management/application/usecases/lesson/removeDay.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

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
    removeDay: jest.fn((_, daysListToRemove) =>
      Promise.resolve(
        `${daysListToRemove.length} ${
          daysListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`
      )
    ),
    addTime: jest.fn(),
    removeTime: jest.fn(),
  };
};

describe('RemoveDay use case unit test', () => {
  const lesson = new Lesson({
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().value,
    studentsList: [new Id().value, new Id().value, new Id().value],
    subject: new Id().value,
    days: ['mon', 'fri'],
    times: ['15:55', '19:00'],
    semester: 2,
  });
  const input = {
    id: lesson.id.value,
    daysListToRemove: ['mon'],
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);

      const usecase = new RemoveDay(lessonRepository);

      await expect(usecase.execute(input)).rejects.toThrow('Lesson not found');
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeDay).not.toHaveBeenCalled();
    });
    it('should throw an error if the day does not exists in the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new RemoveDay(lessonRepository);

      await expect(
        usecase.execute({
          ...input,
          daysListToRemove: ['tue'],
        })
      ).rejects.toThrow(`Day tue is not included in the lesson`);
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeDay).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove days to the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new RemoveDay(lessonRepository);
      const result = await usecase.execute(input);

      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeDay).toHaveBeenCalledWith(
        input.id,
        input.daysListToRemove
      );
      expect(result.message).toBe(`1 value was removed`);
    });
  });
});
