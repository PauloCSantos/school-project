import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindAllSubject from '@/modules/subject-curriculum-management/application/usecases/subject/find-all.usecase';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

describe('findAllSubject usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
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
    role: RoleUsersEnum.MASTER,
    masterId: new Id().value,
  };

  const subject1 = new Subject({
    name: 'Math',
    description: 'Nice description',
  });
  const subject2 = new Subject({
    name: 'English',
    description: 'Nice description',
  });

  describe('On success', () => {
    it('should find all subjects', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.findAll.mockResolvedValue([subject1, subject2]);
      const usecase = new FindAllSubject(subjectRepository, policieService);

      const result = await usecase.execute({}, token);

      expect(subjectRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllSubject(subjectRepository, policieService);

      const result = await usecase.execute({}, token);

      expect(subjectRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
