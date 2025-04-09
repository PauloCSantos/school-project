import Id from '@/modules/@shared/domain/value-object/id.value-object';
import FindAllSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/find-all.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addLessons: jest.fn(),
    removeLessons: jest.fn(),
  };
};

describe('findAllSchedule usecase unit test', () => {
  const schedule1 = new Schedule({
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  });
  const schedule2 = new Schedule({
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  });

  describe('On success', () => {
    it('should find all schedules', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.findAll.mockResolvedValue([schedule1, schedule2]);
      const usecase = new FindAllSchedule(scheduleRepository);

      const result = await usecase.execute({});

      expect(scheduleRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllSchedule(scheduleRepository);

      const result = await usecase.execute({});

      expect(scheduleRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
