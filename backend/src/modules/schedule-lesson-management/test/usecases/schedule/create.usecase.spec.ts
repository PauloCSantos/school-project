import Id from '@/modules/@shared/domain/value-object/id.value-object';
import CreateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/create.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(schedule => Promise.resolve(schedule.id.value)),
    update: jest.fn(),
    delete: jest.fn(),
    addLessons: jest.fn(),
    removeLessons: jest.fn(),
  };
};

describe('createSchedule usecase unit test', () => {
  const schedule = new Schedule({
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  });
  const input = {
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
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
