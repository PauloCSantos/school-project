import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import DeleteSubject from '@/modules/subject-curriculum-management/application/usecases/subject/delete.usecase';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';

describe('deleteSubject usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
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
    description: 'Described subject',
  };

  const subject = new Subject({
    name: input.name,
    description: input.description,
  });

  describe('On fail', () => {
    it('should return an error if the subject does not exist', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteSubject(subjectRepository, policieService);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' }, token)
      ).rejects.toThrow('Subject not found');
    });
  });
  describe('On success', () => {
    it('should delete a subject', async () => {
      const subjectRepository = MockRepository();
      subjectRepository.find.mockResolvedValue(subject);
      const usecase = new DeleteSubject(subjectRepository, policieService);
      const result = await usecase.execute(
        {
          id: subject.id.value,
        },
        token
      );

      expect(subjectRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
