import UpdateLesson from '@/application/usecases/schedule-lesson-management/lesson/updateLesson.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(lesson => Promise.resolve(lesson)),
    delete: jest.fn(),
    addStudents: jest.fn(),
    removeStudents: jest.fn(),
    addDay: jest.fn(),
    removeDay: jest.fn(),
    addTime: jest.fn(),
    removeTime: jest.fn(),
  };
};

describe('updateLesson usecase unit test', () => {
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
    duration: 65,
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateLesson(lessonRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('Lesson not found');
    });
  });
  describe('On success', () => {
    it('should update a lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      const usecase = new UpdateLesson(lessonRepository);

      const result = await usecase.execute(input);

      expect(lessonRepository.update).toHaveBeenCalled();
      expect(lessonRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: input.id,
        name: lesson.name,
        duration: input.duration,
        teacher: lesson.teacher,
        subject: lesson.subject,
        semester: lesson.semester,
      });
    });
  });
});
