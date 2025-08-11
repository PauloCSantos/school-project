import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import AddStudents from '@/modules/schedule-lesson-management/application/usecases/lesson/add-students.usecase';
import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';

describe('AddStudents use case unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addStudents: jest.fn((_, newStudentsList) =>
        Promise.resolve(
          `${newStudentsList.length} ${
            newStudentsList.length === 1 ? 'value was' : 'values were'
          } entered`
        )
      ),
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
    newStudentsList: [new Id().value, new Id().value],
  };

  describe('On fail', () => {
    it('should throw an error if the lesson does not exist', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(undefined);

      const usecase = new AddStudents(lessonRepository, policieService);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Lesson not found'
      );
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).not.toHaveBeenCalled();
    });
    it('should throw an error if the student already exists in the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new AddStudents(lessonRepository, policieService);

      await expect(
        usecase.execute(
          {
            ...input,
            newStudentsList: [lesson.studentsList[0]],
          },
          token
        )
      ).rejects.toThrow(`This student is already on the lesson`);
      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addDay).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add students to the lesson', async () => {
      const lessonRepository = MockRepository();
      lessonRepository.find.mockResolvedValue(lesson);

      const usecase = new AddStudents(lessonRepository, policieService);
      const result = await usecase.execute(input, token);

      expect(lessonRepository.find).toHaveBeenCalledWith(input.id);
      expect(lessonRepository.addStudents).toHaveBeenCalledWith(
        input.id,
        input.newStudentsList
      );
      expect(result.message).toBe(`2 values were entered`);
    });
  });
});
