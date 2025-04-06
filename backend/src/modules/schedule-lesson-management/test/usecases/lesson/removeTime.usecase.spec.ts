import Id from '@/modules/@shared/domain/value-object/id.value-object';
import RemoveTime from '@/modules/schedule-lesson-management/application/usecases/lesson/removeTime.usecase';
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
    removeDay: jest.fn(),
    addTime: jest.fn(),
    removeTime: jest.fn((_, timesListToRemove) =>
      Promise.resolve(
        `${timesListToRemove.length} ${
          timesListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`
      )
    ),
  };
};

describe('RemoveTime use case unit test', () => {
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
    timesListToRemove: ['15:55'],
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);

      const usecase = new RemoveTime(lessonRepository);

      await expect(usecase.execute(input)).rejects.toThrow('Lesson not found');
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeTime).not.toHaveBeenCalled();
    });
    it('should throw an error if the time does not exists in the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new RemoveTime(lessonRepository);

      await expect(
        usecase.execute({
          ...input,
          timesListToRemove: ['10:00'],
        })
      ).rejects.toThrow(`Time 10:00 is not included in the lesson`);
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeTime).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove students to the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new RemoveTime(lessonRepository);
      const result = await usecase.execute(input);

      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeTime).toHaveBeenCalledWith(
        input.id,
        input.timesListToRemove
      );
      expect(result.message).toBe(`1 value was removed`);
    });
  });
});
