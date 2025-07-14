import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/create.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

describe('createLesson usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(lesson => Promise.resolve(lesson.id.value)),
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
    role: 'master',
    masterId: new Id().value,
  };

  const input = {
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().value,
    studentsList: [new Id().value, new Id().value, new Id().value],
    subject: new Id().value,
    days: ['mon', 'fri'] as DayOfWeek[],
    times: ['15:55', '19:00'] as Hour[],
    semester: 2 as 1 | 2,
  };
  const lesson = new Lesson(input);

  describe('On fail', () => {
    it('should throw an error if the lesson already exists', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateLesson(lessonRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Lesson already exists');
      expect(lessonRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(lessonRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(null);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateLesson(lessonRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(lessonRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(lessonRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
