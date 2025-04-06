import Id from '@/modules/@shared/domain/value-object/id.value-object';
import DeleteNote from '@/modules/evaluation-note-attendance-management/application/usecases/note/deleteNote.usecase';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(() => Promise.resolve('Operação concluída com sucesso')),
  };
};

describe('deleteNote usecase unit test', () => {
  const input = {
    evaluation: new Id().value,
    student: new Id().value,
    note: 10,
  };

  const note = new Note(input);

  describe('On fail', () => {
    it('should return an error if the note does not exist', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(undefined);

      const usecase = new DeleteNote(noteRepository);

      await expect(
        usecase.execute({ id: '75c791ca-7a40-4217-8b99-2cf22c01d543' })
      ).rejects.toThrow('Note not found');
    });
  });
  describe('On success', () => {
    it('should delete a note', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(note);
      const usecase = new DeleteNote(noteRepository);
      const result = await usecase.execute({
        id: note.id.value,
      });

      expect(noteRepository.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.message).toBe('Operação concluída com sucesso');
    });
  });
});
