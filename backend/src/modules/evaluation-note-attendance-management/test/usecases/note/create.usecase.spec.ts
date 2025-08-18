import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/create.usecase';

describe('createNote usecase unit test', () => {
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

  const input = {
    evaluation: new Id().value,
    student: new Id().value,
    note: 10,
  };

  describe('On success', () => {
    it('should create a note', async () => {
      const noteRepository = MockRepository();
      noteRepository.create.mockResolvedValue(new Id().value);
      const usecase = new CreateNote(noteRepository, policieService);
      const result = await usecase.execute(input, token);

      expect(noteRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
