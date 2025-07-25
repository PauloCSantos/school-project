import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import UpdateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/update.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

describe('updateSchedule usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

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
    curriculum: new Id().value,
  };

  describe('On fail', () => {
    it('should throw an error if the schedule does not exist', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const usecase = new UpdateSchedule(scheduleRepository);

      await expect(
        usecase.execute(
          {
            ...input,
            id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
          },
          policieService,
          token
        )
      ).rejects.toThrow('Schedule not found');
    });
  });
  describe('On success', () => {
    it('should update a schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const usecase = new UpdateSchedule(scheduleRepository);

      const result = await usecase.execute(
        {
          id: input.id,
          curriculum: input.curriculum,
        },
        policieService,
        token
      );

      expect(scheduleRepository.update).toHaveBeenCalled();
      expect(scheduleRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: input.id,
        curriculum: input.curriculum,
      });
    });
  });
});
