import CreateCurriculum from '@/modules/subject-curriculum-management/application/usecases/curriculum/create.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('createCurriculum usecase unit test', () => {
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

  describe('On success', () => {
    it('should create a curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.create.mockResolvedValue({
        id: curriculum.id.value,
      });

      const usecase = new CreateCurriculum(
        curriculumRepository,
        policieService
      );
      const result = await usecase.execute(input, token);

      expect(curriculumRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
