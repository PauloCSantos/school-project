import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import AddTime from '@/modules/schedule-lesson-management/application/usecases/lesson/add-time.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

describe('AddTime use case unit test', () => {
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
      addTime: jest.fn((_, newTimesList) =>
        Promise.resolve(
          `${newTimesList.length} ${
            newTimesList.length === 1 ? 'value was' : 'values were'
          } entered`
        )
      ),
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
    role: 'master',
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
    newTimesList: ['12:00', '13:00'],
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(null);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddTime(lessonRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Lesson not found');
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).not.toHaveBeenCalled();
    });
    it('should throw an error if the time already exists in the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddTime(lessonRepository);

      await expect(
        usecase.execute(
          {
            ...input,
            newTimesList: [lesson.times[0]],
          },
          policieService,
          token
        )
      ).rejects.toThrow(`Time 15:55 is already added to the lesson`);
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add times to the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddTime(lessonRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addTime).toHaveBeenCalledWith(
        input.id,
        input.newTimesList
      );
      expect(result.message).toBe(`2 values were entered`);
    });
  });
});
