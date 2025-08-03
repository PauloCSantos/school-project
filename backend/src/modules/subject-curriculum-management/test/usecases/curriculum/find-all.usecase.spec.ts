import FindAllCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/find-all.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('findAllCurriculum usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addSubjects: jest.fn(),
      removeSubjects: jest.fn(),
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

  const curriculum1 = new Curriculum({
    name: 'Software Eng',
    subjectsList: [new Id().value, new Id().value],
    yearsToComplete: 5,
  });
  const curriculum2 = new Curriculum({
    name: 'Chemistry Eng',
    subjectsList: [new Id().value, new Id().value],
    yearsToComplete: 5,
  });

  describe('On success', () => {
    it('should find all curriculums', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.findAll.mockResolvedValue([
        curriculum1,
        curriculum2,
      ]);
      const usecase = new FindAllCurriculum(
        curriculumRepository,
        policieService
      );

      const result = await usecase.execute({}, token);

      expect(curriculumRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllCurriculum(
        curriculumRepository,
        policieService
      );

      const result = await usecase.execute({}, token);

      expect(curriculumRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
