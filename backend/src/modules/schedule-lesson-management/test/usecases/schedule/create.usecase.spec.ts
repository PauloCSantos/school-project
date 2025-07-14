import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/create.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

describe('createSchedule usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

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
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  };

  describe('On fail', () => {
    it('should throw an error if the schedule already exists', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateSchedule(scheduleRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Schedule already exists');
      expect(scheduleRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(scheduleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(null);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateSchedule(scheduleRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(scheduleRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(scheduleRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
