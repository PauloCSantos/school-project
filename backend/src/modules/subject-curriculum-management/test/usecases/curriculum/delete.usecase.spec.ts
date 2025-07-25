import DeleteCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/delete.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

describe('deleteCurriculum usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
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
    it('should return an error if the curriculum does not exist', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new DeleteCurriculum(curriculumRepository);

      await expect(
        usecase.execute(
          { id: '75c791ca-7a40-4217-8b99-2cf22c01d543' },
          policieService,
          token
        )
      ).rejects.toThrow('Curriculum not found');
    });
  });
  describe('On success', () => {
    it('should delete a curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);
      policieService.verifyPolicies.mockResolvedValueOnce(true);
      const usecase = new DeleteCurriculum(curriculumRepository);
      const result = await usecase.execute(
        {
          id: curriculum.id.value,
        },
        policieService,
        token
      );

      expect(curriculumRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
