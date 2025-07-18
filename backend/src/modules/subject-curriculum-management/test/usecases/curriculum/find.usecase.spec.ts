import FindCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/find.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('findCurriculum usecase unit test', () => {
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
    role: 'master',
    masterId: new Id().value,
  };

  const curriculum1 = new Curriculum({
    name: 'Software Eng',
    subjectsList: [new Id().value, new Id().value],
    yearsToComplete: 5,
  });

  describe('On success', () => {
    it('should find a curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum1);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const usecase = new FindCurriculum(curriculumRepository);

      const result = await usecase.execute(
        { id: curriculum1.id.value },
        policieService,
        token
      );

      expect(curriculumRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return undefined when id is not found', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindCurriculum(curriculumRepository);
      const result = await usecase.execute(
        {
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        },
        policieService,
        token
      );

      expect(result).toBe(undefined);
    });
  });
});
