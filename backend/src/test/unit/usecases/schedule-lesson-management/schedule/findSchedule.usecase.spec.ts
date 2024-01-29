import FindSchedule from '@/application/usecases/schedule-lesson-management/schedule/findSchedule.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
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

describe('findSchedule usecase unit test', () => {
  const schedule1 = new Schedule({
    student: new Id().id,
    curriculum: new Id().id,
    lessonsList: [new Id().id, new Id().id, new Id().id],
  });

  describe('On success', () => {
    it('should find a schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule1);
      const usecase = new FindSchedule(scheduleRepository);

      const result = await usecase.execute({ id: schedule1.id.id });

      expect(scheduleRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(undefined);

      const usecase = new FindSchedule(scheduleRepository);
      const result = await usecase.execute({
        id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
      });

      expect(result).toBe(undefined);
    });
  });
});
