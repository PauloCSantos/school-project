import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import RemoveLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/remove-lessons.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

describe('RemoveLessons use case unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

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

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> =>
    ({
      verifyPolicies: jest.fn(),
    }) as jest.Mocked<PoliciesServiceInterface>;

  policieService = MockPolicyService();
  token = {
    email: 'caller@domain.com',
    role: 'master',
    masterId: new Id().value,
  };

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
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new RemoveLessons(scheduleRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Schedule not found');
      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.removeLessons).not.toHaveBeenCalled();
    });
    it('should throw an error if the lesson is not found in the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new RemoveLessons(scheduleRepository);

      await expect(
        usecase.execute(
          { ...input, lessonsListToRemove: [new Id().value] },
          policieService,
          token
        )
      ).rejects.toThrow('This lesson is not included in the schedule');
      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.removeLessons).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove lessons from the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new RemoveLessons(scheduleRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.removeLessons).toHaveBeenCalledWith(
        input.id,
        input.lessonsListToRemove
      );
      expect(result.message).toEqual(`1 value was removed`);
    });
  });
});
