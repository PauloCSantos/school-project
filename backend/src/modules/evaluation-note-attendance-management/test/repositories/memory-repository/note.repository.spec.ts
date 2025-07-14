import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import MemoryNoteRepository from '@/modules/evaluation-note-attendance-management/infrastructure/repositories/memory-repository/note.repository';

describe('MemoryNoteRepository unit test', () => {
  let repository: MemoryNoteRepository;

  const evaluation1 = new Id().value;
  const evaluation2 = new Id().value;
  const evaluation3 = new Id().value;
  const student1 = new Id().value;
  const student2 = new Id().value;
  const student3 = new Id().value;
  const noteValue1 = 10;
  const noteValue2 = 5;
  const noteValue3 = 10;

  const note1 = new Note({
    evaluation: evaluation1,
    student: student1,
    note: noteValue1,
  });
  const note2 = new Note({
    evaluation: evaluation2,
    student: student2,
    note: noteValue2,
  });
  const note3 = new Note({
    evaluation: evaluation3,
    student: student3,
    note: noteValue3,
  });

  beforeEach(() => {
    repository = new MemoryNoteRepository([note1, note2]);
  });

  describe('On fail', () => {
    it('should return null if note not found', async () => {
      const noteId = new Id().value;
      const noteFound = await repository.find(noteId);

      expect(noteFound).toBeNull();
    });

    it('should throw an error when trying to update a non-existent note', async () => {
      const nonExistentId = new Id().value;
      const note = new Note({
        id: new Id(nonExistentId),
        evaluation: evaluation3,
        student: student3,
        note: noteValue3,
      });

      await expect(repository.update(note)).rejects.toThrow('Note not found');
    });

    it('should throw an error when trying to delete a non-existent note', async () => {
      const nonExistentId = new Id().value;

      await expect(repository.delete(nonExistentId)).rejects.toThrow(
        'Note not found'
      );
    });
  });

  describe('On success', () => {
    it('should find an existing note by id', async () => {
      const noteId = note1.id.value;
      const noteFound = await repository.find(noteId);

      expect(noteFound).toBeDefined();
      expect(noteFound!.id.value).toBe(note1.id.value);
      expect(noteFound!.evaluation).toBe(note1.evaluation);
      expect(noteFound!.student).toBe(note1.student);
      expect(noteFound!.note).toBe(note1.note);
    });

    it('should create a new note and return its id', async () => {
      const result = await repository.create(note3);

      expect(result).toBe(note3.id.value);

      // Verify note was added to repository
      const noteFound = await repository.find(note3.id.value);
      expect(noteFound).toBeDefined();
      expect(noteFound!.evaluation).toBe(note3.evaluation);
      expect(noteFound!.student).toBe(note3.student);
      expect(noteFound!.note).toBe(note3.note);

      // Verify repository state
      const allNotes = await repository.findAll();
      expect(allNotes.length).toBe(3);
    });

    it('should update an existing note and persist changes', async () => {
      const newEvaluation = new Id().value;
      const updatedNote = new Note({
        id: note2.id,
        evaluation: newEvaluation,
        student: student2,
        note: 8, // Changed from 5
      });

      const result = await repository.update(updatedNote);

      expect(result).toEqual(updatedNote);

      // Verify changes were persisted
      const persisted = await repository.find(note2.id.value);
      expect(persisted).toBeDefined();
      expect(persisted!.evaluation).toBe(newEvaluation);
      expect(persisted!.note).toBe(8);
      expect(persisted!.student).toBe(student2);
    });

    it('should find all the notes', async () => {
      const allNotes = await repository.findAll();

      expect(allNotes.length).toBe(2);
      expect(allNotes[0].evaluation).toBe(note1.evaluation);
      expect(allNotes[1].evaluation).toBe(note2.evaluation);
      expect(allNotes[0].student).toBe(note1.student);
      expect(allNotes[1].student).toBe(note2.student);
      expect(allNotes[0].note).toBe(note1.note);
      expect(allNotes[1].note).toBe(note2.note);
    });

    it('should delete an existing note and update repository state', async () => {
      const response = await repository.delete(note1.id.value);

      expect(response).toBe('Operação concluída com sucesso');

      // Verify note was removed from repository
      const deletedNote = await repository.find(note1.id.value);
      expect(deletedNote).toBeNull();

      // Verify repository state
      const allNotes = await repository.findAll();
      expect(allNotes.length).toBe(1);
      expect(allNotes[0].id.value).toBe(note2.id.value);
    });
  });
});
