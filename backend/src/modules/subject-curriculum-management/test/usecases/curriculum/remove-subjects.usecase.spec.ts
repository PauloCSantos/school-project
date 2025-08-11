import RemoveSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/remove-subjects.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('RemoveSubjects use case unit test', () => {
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
      removeSubjects: jest.fn((_, subjectsListToRemove) =>
        Promise.resolve(
          `${subjectsListToRemove.length} ${
            subjectsListToRemove.length === 1 ? 'value was' : 'values were'
          } removed`
        )
      ),
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

  const curriculum = new Curriculum({
    name: 'Math',
    subjectsList: [new Id().value, new Id().value],
    yearsToComplete: 5,
  });
  const input = {
    id: curriculum.id.value,
    subjectsListToRemove: [curriculum.subjectList[0]],
  };

  describe('On fail', () => {
    it('should throw an error if the curriculum is not found', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(null);

      const usecase = new RemoveSubjects(curriculumRepository, policieService);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Curriculum not found'
      );
      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
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
      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.removeSubjects).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should remove subjects from the curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);

      const usecase = new RemoveSubjects(curriculumRepository, policieService);
      const result = await usecase.execute(input, token);

      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.removeSubjects).toHaveBeenCalledWith(
        input.id,
        input.subjectsListToRemove
      );
      expect(result.message).toEqual(`1 value was removed`);
    });
  });
});
