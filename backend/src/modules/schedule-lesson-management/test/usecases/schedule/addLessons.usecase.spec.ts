import Id from '@/modules/@shared/domain/value-object/id.value-object';
import AddLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/addLessons.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addLessons: jest.fn((_, newLessonsList) =>
      Promise.resolve(
        `${newLessonsList.length} ${
          newLessonsList.length === 1 ? 'value was' : 'values were'
        } entered`
      )
    ),
    removeLessons: jest.fn(),
  };
};

describe('AddLessons use case unit test', () => {
  const schedule = new Schedule({
    student: new Id().id,
    curriculum: new Id().id,
    lessonsList: [new Id().id, new Id().id, new Id().id],
  });
  const input = {
    id: schedule.id.id,
    newLessonsList: [new Id().id, new Id().id, new Id().id],
  };

  describe('On fail', () => {
    it('should throw an error if the schedule does not exist', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(undefined);

      const usecase = new AddLessons(scheduleRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Schedule not found'
      );
      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.addLessons).not.toHaveBeenCalled();
    });
    it('should throw an error if the lesson`s id is already on the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);

      const usecase = new AddLessons(scheduleRepository);

      await expect(
        usecase.execute({
          ...input,
          newLessonsList: [schedule.lessonsList[1]],
        })
      ).rejects.toThrow('This lesson is already on the schedule');
      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.addLessons).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add lessons to the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);

      const usecase = new AddLessons(scheduleRepository);
      const result = await usecase.execute(input);

      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.addLessons).toHaveBeenCalledWith(
        input.id,
        input.newLessonsList
      );
      expect(result.message).toBe(`3 values were entered`);
    });
  });
});
