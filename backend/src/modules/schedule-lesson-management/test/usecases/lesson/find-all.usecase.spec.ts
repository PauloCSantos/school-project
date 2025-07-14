import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindAllLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/find-all.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

describe('findAllLesson usecase unit test', () => {
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
    role: 'master',
    masterId: new Id().value,
  };

  const lesson1 = new Lesson({
    name: 'Math advanced I',
    duration: 60,
    teacher: new Id().value,
    studentsList: [new Id().value, new Id().value, new Id().value],
    subject: new Id().value,
    days: ['mon', 'fri'] as DayOfWeek[],
    times: ['15:55', '19:00'] as Hour[],
    semester: 2 as 1 | 2,
  });
  const lesson2 = new Lesson({
    name: 'Math advanced II',
    duration: 60,
    teacher: new Id().value,
    studentsList: [new Id().value, new Id().value, new Id().value],
    subject: new Id().value,
    days: ['mon', 'fri'] as DayOfWeek[],
    times: ['15:55', '19:00'] as Hour[],
    semester: 2 as 1 | 2,
  });

  describe('On success', () => {
    it('should find all lessons', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.findAll.mockResolvedValue([lesson1, lesson2]);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindAllLesson(lessonRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(lessonRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.findAll.mockResolvedValue([]);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindAllLesson(lessonRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(lessonRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
