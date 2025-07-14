import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import RemoveStudents from '@/modules/schedule-lesson-management/application/usecases/lesson/remove-students.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

describe('RemoveStudent use case unit test', () => {
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
      removeStudents: jest.fn((_, studentsListToRemove) =>
        Promise.resolve(
          `${studentsListToRemove.length} ${
            studentsListToRemove.length === 1 ? 'value was' : 'values were'
          } removed`
        )
      ),
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
    studentsListToRemove: [lesson.studentsList[0]],
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new RemoveStudents(lessonRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Lesson not found');
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeStudents).not.toHaveBeenCalled();
    });
    it('should throw an error if the student does not exists in the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new RemoveStudents(lessonRepository);

      await expect(
        usecase.execute(
          {
            ...input,
            studentsListToRemove: [new Id().value],
          },
          policieService,
          token
        )
      ).rejects.toThrow(`This student is not included in the lesson`);
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeStudents).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove students to the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new RemoveStudents(lessonRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.removeStudents).toHaveBeenCalledWith(
        input.id,
        input.studentsListToRemove
      );
      expect(result.message).toBe(`1 value was removed`);
    });
  });
});
