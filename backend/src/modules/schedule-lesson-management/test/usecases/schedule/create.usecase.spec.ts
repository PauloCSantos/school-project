import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
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
      create: jest.fn(),
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
    role: RoleUsersEnum.MASTER,
    masterId: new Id().value,
  };

  const input = {
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  };

  const schedule = new Schedule(input);

  describe('On success', () => {
    it('should create a schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.create.mockResolvedValue(schedule);

      const usecase = new CreateSchedule(scheduleRepository, policieService);
      const result = await usecase.execute(input, token);

      expect(scheduleRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
