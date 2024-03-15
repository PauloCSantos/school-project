import CreateNote from '@/application/usecases/evaluation-note-attendance-management/note/createNote.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(note => Promise.resolve(note.id.id)),
    update: jest.fn(),
    delete: jest.fn(),
  };
};

describe('createNote usecase unit test', () => {
  const input = {
    evaluation: new Id().id,
    student: new Id().id,
    note: 10,
  };

  const note = new Note(input);

  describe('On fail', () => {
    it('should throw an error if the note already exists', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(note);

      const usecase = new CreateNote(noteRepository);

      await expect(usecase.execute(input)).rejects.toThrow(
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

      const usecase = new CreateNote(noteRepository);
      const result = await usecase.execute(input);

      expect(noteRepository.find).toHaveBeenCalledWith(expect.any(String));
      expect(noteRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
