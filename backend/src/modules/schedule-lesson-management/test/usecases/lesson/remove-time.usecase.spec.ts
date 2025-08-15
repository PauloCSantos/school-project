import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import RemoveTime from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-time.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

describe('RemoveTime use case unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addStudents: jest.fn(),
      removeStudents: jest.fn(),
      addDay: jest.fn(),
      removeDay: jest.fn(),
      addTime: jest.fn(),
      removeTime: jest.fn(),
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

  const lesson = new Lesson({
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().value,
    studentsList: [new Id().value, new Id().value, new Id().value],
    subject: new Id().value,
    days: ['mon', 'fri'],
    times: ['15:55', '19:00'],
    semester: 2,
  });
  const input = {
    id: lesson.id.value,
    timesListToRemove: ['15:55'],
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(null);

      const usecase = new RemoveTime(lessonRepository, policieService);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Lesson not found'
      );
      expect(lessonRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(lessonRepository.removeTime).not.toHaveBeenCalled();
    });
    it('should throw an error if the time does not exists in the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new RemoveTime(lessonRepository, policieService);

      await expect(
        usecase.execute(
          {
            ...input,
            timesListToRemove: ['10:00'],
          },
          token
        )
      ).rejects.toThrow(`Time 10:00 is not included in the lesson`);
      expect(lessonRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(lessonRepository.removeTime).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove students to the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      lessonRepository.removeTime.mockResolvedValue('1 value was removed');

      const usecase = new RemoveTime(lessonRepository, policieService);
      const result = await usecase.execute(input, token);

      expect(lessonRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(lessonRepository.removeTime).toHaveBeenCalledWith(
        token.masterId,
        input.id,
        expect.objectContaining({
          times: expect.arrayContaining(lesson.times),
        })
      );
      expect(result.message).toBe('1 value was removed');
    });
  });
});
