import Id from '@/modules/@shared/domain/value-object/id.value-object';
import UpdateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/updateSchedule.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(schedule => Promise.resolve(schedule)),
    delete: jest.fn(),
    addLessons: jest.fn(),
    removeLessons: jest.fn(),
  };
};

describe('updateSchedule usecase unit test', () => {
  const schedule = new Schedule({
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  });
  const input = {
    id: schedule.id.value,
    curriculum: new Id().value,
  };

  describe('On fail', () => {
    it('should throw an error if the schedule does not exist', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateSchedule(scheduleRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('Schedule not found');
    });
  });
  describe('On success', () => {
    it('should update a schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);
      const usecase = new UpdateSchedule(scheduleRepository);

      const result = await usecase.execute({
        id: input.id,
        curriculum: input.curriculum,
      });

      expect(scheduleRepository.update).toHaveBeenCalled();
      expect(scheduleRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: input.id,
        curriculum: input.curriculum,
      });
    });
  });
});
