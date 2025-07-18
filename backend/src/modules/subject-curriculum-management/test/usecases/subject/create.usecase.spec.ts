import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/create.usecase';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

describe('createSubject usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(subject => Promise.resolve(subject.id.value)),
      update: jest.fn(),
      delete: jest.fn(),
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
    description: 'Described a subject',
  };

  const subject = new Subject({
    name: input.name,
    description: input.description,
  });

  describe('On fail', () => {
    it('should throw an error if the subject already exists', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(subject);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateSubject(subjectRepository);

      await expect(
        usecase.execute(input, policieService, token)
      ).rejects.toThrow('Subject already exists');
      expect(subjectRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(subjectRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a subject', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(undefined);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new CreateSubject(subjectRepository);
      const result = await usecase.execute(input, policieService, token);

      expect(subjectRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(subjectRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
