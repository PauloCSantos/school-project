import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindSchedule from '@/modules/schedule-lesson-management/application/usecases/schedule/find.usecase';
import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';

describe('findSchedule usecase unit test', () => {
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

  const schedule1 = new Schedule({
    student: new Id().value,
    curriculum: new Id().value,
    lessonsList: [new Id().value, new Id().value, new Id().value],
  });

  describe('On success', () => {
    it('should find a schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule1);
      const usecase = new FindSchedule(scheduleRepository, policieService);

      const result = await usecase.execute({ id: schedule1.id.value }, token);

      expect(scheduleRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(undefined);

      const usecase = new FindSchedule(scheduleRepository, policieService);
      const result = await usecase.execute(
        {
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        },
        token
      );

      expect(result).toBe(undefined);
    });
  });
});
