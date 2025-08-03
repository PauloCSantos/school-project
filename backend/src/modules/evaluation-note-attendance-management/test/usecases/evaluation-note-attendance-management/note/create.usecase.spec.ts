import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import CreateNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/create.usecase';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';

describe('createNote usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(note => Promise.resolve(note.id.value)),
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

  const note = new Note(input);

  describe('On fail', () => {
    it('should throw an error if the note already exists', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(note);

      const usecase = new CreateNote(noteRepository, policieService);

      await expect(usecase.execute(input, token)).rejects.toThrow(
        'Note already exists'
      );
      expect(noteRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(noteRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('On success', () => {
    it('should create a note', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(undefined);

      const usecase = new CreateNote(noteRepository, policieService);
      const result = await usecase.execute(input, token);

      expect(noteRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(noteRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
