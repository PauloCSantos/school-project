import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import DeleteNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/delete.usecase';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import NoteGateway from '@/modules/evaluation-note-attendance-management/application/gateway/note.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('deleteNote usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = (): jest.Mocked<NoteGateway> => {
    return {
      find: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn((_id: string) =>
        Promise.resolve('Operação concluída com sucesso')
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
  const input = {
    evaluation: new Id().value,
    student: new Id().value,
    note: 10,
  };

  const note = new Note(input);

  describe('On fail', () => {
    it('should return an error if the note does not exist', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(null);

      const usecase = new DeleteNote(noteRepository, policieService);

      await expect(
        usecase.execute(
          { id: '75c791ca-7a40-4217-8b99-2cf22c01d543' },

          token
        )
      ).rejects.toThrow('Note not found');
    });
  });
  describe('On success', () => {
    it('should delete a note', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(note);

      const usecase = new DeleteNote(noteRepository, policieService);
      const result = await usecase.execute(
        {
          id: note.id.value,
        },
        token
      );

      expect(noteRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
