import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import AddSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/add-subjects.usecase';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';

describe('AddSubjects use case unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addSubjects: jest.fn((_, newSubjectsList) =>
        Promise.resolve(
          `${newSubjectsList.length} ${
            newSubjectsList.length === 1 ? 'value was' : 'values were'
          } entered`
        )
      ),
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

  const curriculum = new Curriculum({
    name: 'Math',
    subjectsList: [new Id().value, new Id().value],
    yearsToComplete: 5,
  });
  const input = {
    id: curriculum.id.value,
    newSubjectsList: [new Id().value, new Id().value, new Id().value],
  };

  describe('On fail', () => {
    it('should throw an error if the curriculum does not exist', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddSubjects(curriculumRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Curriculum not found');
      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.addSubjects).not.toHaveBeenCalled();
    });
    it('should throw an error if the subject`s id does not exist in curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddSubjects(curriculumRepository);

      await expect(
        usecase.execute(
          {
            ...input,
            newSubjectsList: [curriculum.subjectList[1]],
          },
          policieService,
          token
        )
      ).rejects.toThrow('This subject is already on the curriculum');
      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.addSubjects).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add subjects to the curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new AddSubjects(curriculumRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(curriculumRepository.find).toHaveBeenCalledWith(input.id);
      expect(curriculumRepository.addSubjects).toHaveBeenCalledWith(
        input.id,
        input.newSubjectsList
      );
      expect(result.message).toBe(`3 values were entered`);
    });
  });
});
