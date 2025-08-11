import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import UpdateLesson from '@/modules/schedule-lesson-management/application/usecases/lesson/update.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

describe('updateLesson usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(lesson => Promise.resolve(lesson)),
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
    duration: 65,
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(null);

      const usecase = new UpdateLesson(lessonRepository, policieService);

      await expect(
        usecase.execute(
          {
            ...input,
            id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
          },
          token
        )
      ).rejects.toThrow('Lesson not found');
    });
  });
  describe('On success', () => {
    it('should update a lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new UpdateLesson(lessonRepository, policieService);

      const result = await usecase.execute(input, token);

      expect(lessonRepository.update).toHaveBeenCalled();
      expect(lessonRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: input.id,
        name: lesson.name,
        duration: input.duration,
        teacher: lesson.teacher,
        subject: lesson.subject,
        semester: lesson.semester,
      });
    });
  });
});
