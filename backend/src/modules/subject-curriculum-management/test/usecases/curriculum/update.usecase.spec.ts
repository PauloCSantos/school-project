import UpdateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/update.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('updateCurriculum usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(curriculum => Promise.resolve(curriculum)),
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
    name: 'Software Eng',
    yearsToComplete: 6,
  };

  const curriculum1 = new Curriculum({
    name: 'Math',
    subjectsList: [new Id().value, new Id().value],
    yearsToComplete: 5,
  });

  describe('On fail', () => {
    it('should throw an error if the curriculum does not exist', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const usecase = new UpdateCurriculum(curriculumRepository);

      await expect(
        usecase.execute(
          {
            ...input,
            id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
          },
          policieService,
          token
        )
      ).rejects.toThrow('Curriculum not found');
    });
  });
  describe('On success', () => {
    it('should update a curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum1);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const usecase = new UpdateCurriculum(curriculumRepository);

      const result = await usecase.execute(
        {
          id: curriculum1.id.value,
          name: input.name,
          yearsToComplete: input.yearsToComplete,
        },
        policieService,
        token
      );

      expect(curriculumRepository.update).toHaveBeenCalled();
      expect(curriculumRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: curriculum1.id.value,
        name: input.name,
        yearsToComplete: input.yearsToComplete,
      });
    });
  });
});
