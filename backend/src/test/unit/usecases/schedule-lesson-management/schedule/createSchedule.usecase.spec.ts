import CreateSchedule from '@/application/usecases/schedule-lesson-management/schedule/createSchedule.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(schedule => Promise.resolve(schedule.id.id)),
    update: jest.fn(),
    delete: jest.fn(),
    addLessons: jest.fn(),
    removeLessons: jest.fn(),
  };
};

describe('createSchedule usecase unit test', () => {
  const schedule = new Schedule({
    student: new Id().id,
    curriculum: new Id().id,
    lessonsList: [new Id().id, new Id().id, new Id().id],
  });
  const input = {
    student: new Id().id,
    curriculum: new Id().id,
    lessonsList: [new Id().id, new Id().id, new Id().id],
  };

  describe('On fail', () => {
    it('should throw an error if the schedule already exists', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);

      const usecase = new CreateSchedule(scheduleRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
        'Schedule already exists'
      );
      expect(scheduleRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(scheduleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateSchedule(scheduleRepository);
      const result = await usecase.execute(input);

      expect(scheduleRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(scheduleRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
