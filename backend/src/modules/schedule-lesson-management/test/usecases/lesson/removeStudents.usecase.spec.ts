import Id from '@/modules/@shared/domain/value-object/id.value-object';
import RemoveStudents from '@/modules/schedule-lesson-management/application/usecases/lesson/removeStudents.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addStudents: jest.fn(),
    removeStudents: jest.fn((_, studentsListToRemove) =>
      Promise.resolve(
        `${studentsListToRemove.length} ${
          studentsListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`
      )
    ),
    addDay: jest.fn(),
    removeDay: jest.fn(),
    addTime: jest.fn(),
    removeTime: jest.fn(),
  };
};

describe('RemoveStudent use case unit test', () => {
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
    studentsListToRemove: [lesson.studentList[0]],
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);

      const usecase = new RemoveStudents(lessonRepository);

      await expect(usecase.execute(input)).rejects.toThrow('Lesson not found');
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeStudents).not.toHaveBeenCalled();
    });
    it('should throw an error if the student does not exists in the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new RemoveStudents(lessonRepository);

      await expect(
        usecase.execute({
          ...input,
          studentsListToRemove: [new Id().id],
        })
      ).rejects.toThrow(`This student is not included in the lesson`);
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeStudents).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove students to the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new RemoveStudents(lessonRepository);
      const result = await usecase.execute(input);

      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeStudents).toHaveBeenCalledWith(
        input.id,
        input.studentsListToRemove
      );
      expect(result.message).toBe(`1 value was removed`);
    });
  });
});
