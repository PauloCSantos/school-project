import CreateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/create.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('createCurriculum usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(curriculum => Promise.resolve(curriculum.id.value)),
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

  const input = {
    name: 'Math',
    subjectsList: [new Id().value, new Id().value, new Id().value],
    yearsToComplete: 5,
  };

  const curriculum = new Curriculum({
    name: input.name,
    subjectsList: input.subjectsList,
    yearsToComplete: input.yearsToComplete,
  });

  describe('On fail', () => {
    it('should throw an error if the curriculum already exists', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateCurriculum(curriculumRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Curriculum already exists');
      expect(curriculumRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(curriculumRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateCurriculum(curriculumRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(curriculumRepository.find).toHaveBeenCalledWith(
        expect.any(String)
      );
      expect(curriculumRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
