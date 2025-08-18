import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
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

      const usecase = new RemoveLessons(scheduleRepository, policieService);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Schedule not found'
      );
      expect(scheduleRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(scheduleRepository.removeLessons).not.toHaveBeenCalled();
    });
    it('should throw an error if the lesson is not found in the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);

      const usecase = new RemoveLessons(scheduleRepository, policieService);

      await expect(
        usecase.execute(
          { ...input, lessonsListToRemove: [new Id().value] },
          token
        )
      ).rejects.toThrow('This lesson is not included in the schedule');
      expect(scheduleRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(scheduleRepository.removeLessons).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove lessons from the schedule', async () => {
      const scheduleRepository = MockRepository();
      scheduleRepository.find.mockResolvedValue(schedule);
      scheduleRepository.removeLessons.mockResolvedValue('1 value was removed');

      const usecase = new RemoveLessons(scheduleRepository, policieService);
      const result = await usecase.execute(input, token);

      expect(scheduleRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(scheduleRepository.removeLessons).toHaveBeenCalledWith(
        token.masterId,
        input.id,
        expect.objectContaining({
          lessonsList: expect.arrayContaining(schedule.lessonsList),
        })
      );
      expect(result.message).toEqual('1 value was removed');
    });
  });
});
