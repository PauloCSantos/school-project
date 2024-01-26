import DeleteSchedule from '@/application/usecases/schedule-lesson-management/schedule/deleteSchedule.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Schedule from '@/modules/schedule-lesson-management/schedule/domain/entity/schedule.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
    addLessons: jest.fn(),
    removeLessons: jest.fn(),
  };
};

describe('deleteSchedule usecase unit test', () => {
  const schedule = new Schedule({
    student: new Id().id,
    curriculum: new Id().id,
    lessonsList: [new Id().id, new Id().id, new Id().id],
  });

  describe('On fail', () => {
    it('should return an error if the schedule does not exist', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteSchedule(scheduleRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('Schedule not found');
    });
  });
  describe('On success', () => {
    it('should delete a schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);
      const usecase = new DeleteSchedule(scheduleRepository);
      const result = await usecase.execute({
        id: schedule.id.id,
      });

      expect(scheduleRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
