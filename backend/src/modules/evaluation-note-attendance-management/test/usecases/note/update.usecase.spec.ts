import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import UpdateNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/update.usecase';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import NoteGateway from '@/modules/evaluation-note-attendance-management/application/gateway/note.gateway';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

describe('updateNote usecase unit test', () => {
  let policieService: jest.Mocked<PoliciesServiceInterface>;
  let token: TokenData;

  const MockRepository = (): jest.Mocked<NoteGateway> => {
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
    note: 8,
  };

  const note1 = new Note({
    evaluation: new Id().value,
    student: new Id().value,
    note: 10,
  });

  describe('On fail', () => {
    it('should throw an error if the note does not exist', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(null);

      const usecase = new UpdateNote(noteRepository, policieService);

      await expect(
        usecase.execute(
          {
            ...input,
            id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
          },
          token
        )
      ).rejects.toThrow('Note not found');
    });
  });
  describe('On success', () => {
    it('should update a note', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(note1);
      noteRepository.update.mockResolvedValue(note1);

      const usecase = new UpdateNote(noteRepository, policieService);

      const result = await usecase.execute(
        {
          id: note1.id.value,
          ...input,
        },
        token
      );

      expect(noteRepository.update).toHaveBeenCalled();
      expect(noteRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        id: note1.id.value,
        evaluation: note1.evaluation,
        student: note1.student,
        note: input.note,
        state: note1.state,
      });
    });
  });
});
