import FindAllNote from '@/application/usecases/evaluation-note-attendance-management/note/findAllNote.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';

const MockRepository = () => {
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
    evaluation: new Id().id,
    student: new Id().id,
    note: 10,
  });
  const note2 = new Note({
    evaluation: new Id().id,
    student: new Id().id,
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
