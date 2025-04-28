import Id from '@/modules/@shared/domain/value-object/id.value-object';
import FindAllNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/find-all.usecase';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';

const MockRepository = (): jest.Mocked<NoteGateway> => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('findAllNote usecase unit test', () => {
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
      const usecase = new FindAllNote(noteRepository);

      const result = await usecase.execute({});

      expect(noteRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });
    it('should return an empty array when the repository is empty', async () => {
      const noteRepository = MockRepository();
      noteRepository.findAll.mockResolvedValue([]);
      const usecase = new FindAllNote(noteRepository);

      const result = await usecase.execute({});

      expect(noteRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(0);
    });
  });
});
