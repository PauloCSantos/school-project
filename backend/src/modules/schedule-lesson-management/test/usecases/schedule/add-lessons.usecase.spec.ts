import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import AddLessons from '@/modules/schedule-lesson-management/application/usecases/schedule/add-lessons.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

describe('AddLessons use case unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

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
    newLessonsList: [new Id().value, new Id().value, new Id().value],
  };

  describe('On fail', () => {
    it('should throw an error if the schedule does not exist', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddLessons(scheduleRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Schedule not found');
      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.addLessons).not.toHaveBeenCalled();
    });
    it('should throw an error if the lesson`s id is already on the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddLessons(scheduleRepository);

      await expect(
        usecase.execute(
          {
            ...input,
            newLessonsList: [schedule.lessonsList[1]],
          },
          policieService,
          token
        )
      ).rejects.toThrow('This lesson is already on the schedule');
      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.addLessons).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add lessons to the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddLessons(scheduleRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(scheduleRepository.find).toHaveBeenCalledWith(input.id);
      expect(scheduleRepository.addLessons).toHaveBeenCalledWith(
        input.id,
        input.newLessonsList
      );
      expect(result.message).toBe(`3 values were entered`);
    });
  });
});
