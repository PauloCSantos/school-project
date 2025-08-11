import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import UpdateSubject from '@/modules/subject-curriculum-management/application/usecases/subject/update.usecase';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

describe('updateSubject usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(subject => Promise.resolve(subject)),
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

  const input = {
    name: 'Japanese',
    description: 'Described subject',
  };

  const subject1 = new Subject({
    name: 'Math',
    description: 'Described subject',
  });

  describe('On fail', () => {
    it('should throw an error if the subject does not exist', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateSubject(subjectRepository, policieService);

      await expect(
        usecase.execute(
          {
            ...input,
            id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
          },
          token
        )
      ).rejects.toThrow('Subject not found');
    });
  });
  describe('On success', () => {
    it('should update a subject', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(subject1);
      const usecase = new UpdateSubject(subjectRepository, policieService);

      const result = await usecase.execute(
        {
          id: subject1.id.value,
          name: input.name,
        },
        token
      );

      expect(subjectRepository.update).toHaveBeenCalled();
      expect(subjectRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: subject1.id.value,
        name: input.name,
        description: subject1.description,
      });
    });
  });
});
