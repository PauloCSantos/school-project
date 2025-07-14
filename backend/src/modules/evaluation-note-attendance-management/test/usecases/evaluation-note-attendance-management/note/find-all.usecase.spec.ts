import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindAllNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/find-all.usecase';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';

describe('findAllNote usecase unit test', () => {
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
  const note2 = new Note({
    evaluation: new Id().value,
    student: new Id().value,
    note: 8,
  });

  describe('On success', () => {
    it('should find all notes', async () => {
      const noteRepository = MockRepository();
      noteRepository.findAll.mockResolvedValue([note1, note2]);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindAllNote(noteRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(noteRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const noteRepository = MockRepository();
      noteRepository.findAll.mockResolvedValue([]);
      policieService.verifyPolicies.mockResolvedValueOnce(true);

      const usecase = new FindAllNote(noteRepository);

      const result = await usecase.execute({}, policieService, token);

      expect(noteRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
