import RemoveSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/remove-subjects.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('RemoveSubjects use case unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;
  let curriculum: Curriculum;
  let input: {
    id: string;
    subjectsListToRemove: string[];
  };

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

  beforeEach(() => {
    curriculum = new Curriculum({
      name: 'Math',
      subjectsList: [new Id().value, new Id().value],
      yearsToComplete: 5,
    });
    input = {
      id: curriculum.id.value,
      subjectsListToRemove: [curriculum.subjectList[0]],
    };
  });

  describe('On fail', () => {
    it('should throw an error if the curriculum is not found', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(null);

      const usecase = new RemoveSubjects(curriculumRepository, policieService);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Curriculum not found'
      );
      expect(curriculumRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(curriculumRepository.removeSubjects).not.toHaveBeenCalled();
    });
    it('should throw an error if the subject is not found in the curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);

      const usecase = new RemoveSubjects(curriculumRepository, policieService);

      await expect(
        usecase.execute(
          { ...input, subjectsListToRemove: [new Id().value] },
          token
        )
      ).rejects.toThrow('This subject is not included in the curriculum');
      expect(curriculumRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(curriculumRepository.removeSubjects).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove subjects from the curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);
      curriculumRepository.removeSubjects.mockResolvedValue(
        '1 value was removed'
      );

      const usecase = new RemoveSubjects(curriculumRepository, policieService);
      const result = await usecase.execute(input, token);

      expect(curriculumRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(curriculumRepository.removeSubjects).toHaveBeenCalledWith(
        token.masterId,
        input.id,
        expect.objectContaining({
          subjectList: expect.arrayContaining(curriculum.subjectList),
        })
      );
      expect(result.message).toBe('1 value was removed');
    });
  });
});
