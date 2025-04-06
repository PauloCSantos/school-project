import Id from '@/modules/@shared/domain/value-object/id.value-object';
import DeleteLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/deleteLesson.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
    addStudents: jest.fn(),
    removeStudents: jest.fn(),
    addDay: jest.fn(),
    removeDay: jest.fn(),
    addTime: jest.fn(),
    removeTime: jest.fn(),
  };
};

describe('deleteLesson usecase unit test', () => {
  const lesson = new Lesson({
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().id,
    studentsList: [new Id().id, new Id().id, new Id().id],
    subject: new Id().id,
    days: ['mon', 'fri'] as DayOfWeek[],
    times: ['15:55', '19:00'] as Hour[],
    semester: 2 as 1 | 2,
  });

  describe('On fail', () => {
    it('should return an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteLesson(lessonRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('Lesson not found');
    });
  });
  describe('On success', () => {
    it('should delete a lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      const usecase = new DeleteLesson(lessonRepository);
      const result = await usecase.execute({
        id: lesson.id.id,
      });

      expect(lessonRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
