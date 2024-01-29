import UpdateNote from '@/application/usecases/evaluation-note-attendance-management/note/updateNote.usecase';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(note => Promise.resolve(note)),
    delete: jest.fn(),
  };
};

describe('updateNote usecase unit test', () => {
  const input = {
    note: 8,
  };

  const note1 = new Note({
    evaluation: new Id().id,
    student: new Id().id,
    note: 10,
  });

  describe('On fail', () => {
    it('should throw an error if the note does not exist', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(undefined);
      const usecase = new UpdateNote(noteRepository);

      await expect(
        usecase.execute({
          ...input,
          id: '75c791ca-7a40-4217-8b99-2cf22c01d543',
        })
      ).rejects.toThrow('Note not found');
    });
  });
  describe('On success', () => {
    it('should update an note', async () => {
      const noteRepository = MockRepository();
      noteRepository.find.mockResolvedValue(note1);
      const usecase = new UpdateNote(noteRepository);

      const result = await usecase.execute({
        id: note1.id.id,
        ...input,
      });

      expect(noteRepository.update).toHaveBeenCalled();
      expect(noteRepository.find).toHaveBeenCalled();
      expect(result).toStrictEqual({
        evaluation: note1.evaluation,
        student: note1.student,
        note: input.note,
      });
    });
  });
});
