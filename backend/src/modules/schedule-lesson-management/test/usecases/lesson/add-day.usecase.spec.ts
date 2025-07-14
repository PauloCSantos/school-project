import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import AddDay from '@/modules/schedule-lesson-management/application/usecases/lesson/add-day.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

describe('AddDay use case unit test', () => {
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
      addDay: jest.fn((_, newDaysList) =>
        Promise.resolve(
          `${newDaysList.length} ${
            newDaysList.length === 1 ? 'value was' : 'values were'
          } entered`
        )
      ),
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
    newDaysList: ['tue'],
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddDay(lessonRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Lesson not found');
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).not.toHaveBeenCalled();
    });
    it('should throw an error if the day already exists in the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddDay(lessonRepository);

      await expect(
        usecase.execute(
          {
            ...input,
            newDaysList: ['mon'],
          },
          policieService,
          token
        )
      ).rejects.toThrow(`Day mon is already added to the lesson`);
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add days to the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddDay(lessonRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).toHaveBeenCalledWith(
        input.id,
        input.newDaysList
      );
      expect(result.message).toBe(`1 value was entered`);
    });
  });
});
