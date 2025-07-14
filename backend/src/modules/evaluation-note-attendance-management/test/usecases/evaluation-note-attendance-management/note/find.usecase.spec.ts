import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/find.usecase';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';

describe('findNote usecase unit test', () => {
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
    role: 'master',
    masterId: new Id().value,
  };

  const note1 = new Note({
    evaluation: new Id().value,
    student: new Id().value,
    note: 10,
  });
  describe('On success', () => {
    it('should find a note', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(note1);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindNote(noteRepository);

      const result = await usecase.execute(
        { id: note1.id.value },
        policieService,
        token
      );

      expect(noteRepository.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should return null when id is not found', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(null);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindNote(noteRepository);
      const result = await usecase.execute(
        {
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        },
        policieService,
        token
      );

      expect(result).toBe(null);
    });
  });
});
