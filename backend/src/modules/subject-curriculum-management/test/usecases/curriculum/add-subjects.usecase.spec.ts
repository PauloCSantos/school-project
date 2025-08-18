import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CurriculumGateway from '@/modules/subject-curriculum-management/application/gateway/curriculum.gateway';
import AddSubjects from '@/modules/subject-curriculum-management/application/usecases/curriculum/add-subjects.usecase';
import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';

describe('AddSubjects use case unit test', () => {
  let curriculum: Curriculum;
  let token: TokenData;
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let input: {
    id: string;
    newSubjectsList: string[];
  };

  const MockRepository = (): jest.Mocked<CurriculumGateway> => {
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

  const MockPolicyService = (): jest.Mocked<PoliciesServiceInterface> => ({
    verifyPolicies: jest.fn(),
  });

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
      newSubjectsList: [new Id().value, new Id().value, new Id().value],
    };
  });

  describe('On fail', () => {
    it('should throw an error if the curriculum does not exist', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(null);

      const usecase = new AddSubjects(curriculumRepository, policieService);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Curriculum not found'
      );
      expect(curriculumRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(curriculumRepository.addSubjects).not.toHaveBeenCalled();
    });
    it('should throw an error if the subject`s id is already on the curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);

      const usecase = new AddSubjects(curriculumRepository, policieService);

      await expect(
        usecase.execute(
          {
            ...input,
            newSubjectsList: [curriculum.subjectList[1]],
          },
          token
        )
      ).rejects.toThrow('This subject is already on the curriculum');
      expect(curriculumRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(curriculumRepository.addSubjects).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should add subjects to the curriculum', async () => {
      const curriculumRepository = MockRepository();
      curriculumRepository.find.mockResolvedValue(curriculum);
      curriculumRepository.addSubjects.mockResolvedValue(
        '3 values were entered'
      );

      const usecase = new AddSubjects(curriculumRepository, policieService);
      const result = await usecase.execute(input, token);

      expect(curriculumRepository.find).toHaveBeenCalledWith(
        token.masterId,
        input.id
      );
      expect(curriculumRepository.addSubjects).toHaveBeenCalledWith(
        token.masterId,
        input.id,
        expect.objectContaining({
          subjectList: expect.arrayContaining(curriculum.subjectList),
        })
      );
      expect(result.message).toBe('3 values were entered');
    });
  });
});
