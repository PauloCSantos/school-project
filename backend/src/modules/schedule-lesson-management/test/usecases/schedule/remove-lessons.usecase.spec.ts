import Id from '@/modules/@shared/domain/value-object/id.value-object';
import RemoveLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/remove-lessons.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addLessons: jest.fn(),
    removeLessons: jest.fn((_, lessonsListToRemove) =>
      Promise.resolve(
        `${lessonsListToRemove.length} ${
          lessonsListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`
      )
    ),
  };
};

describe('RemoveLessons use case unit test', () => {
  const schedule = new Schedule({
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  });
  const input = {
    id: schedule.id.value,
    lessonsListToRemove: [schedule.lessonsList[0]],
  };

  describe('On fail', () => {
    it('should throw an error if the schedule is not found', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(undefined);

      const usecase = new RemoveLessons(scheduleRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Schedule not found'
      );
      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.removeLessons).not.toHaveBeenCalled();
    });
    it('should throw an error if the lesson is not found in the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);

      const usecase = new RemoveLessons(scheduleRepository);

      await expect(
        usecase.execute({ ...input, lessonsListToRemove: [new Id().value] })
      ).rejects.toThrow('This lesson is not included in the schedule');
      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.removeLessons).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove lessons from the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);

      const usecase = new RemoveLessons(scheduleRepository);
      const result = await usecase.execute(input);

      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.removeLessons).toHaveBeenCalledWith(
        input.id,
        input.lessonsListToRemove
      );
      expect(result.message).toEqual(`1 value was removed`);
    });
  });
});
