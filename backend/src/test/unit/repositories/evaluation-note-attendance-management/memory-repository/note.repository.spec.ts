import MemoryNoteRepository from '@/infraestructure/repositories/evaluation-note-attendance-management/memory-repository/note.repository';
import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';

describe('MemoryNoteRepository unit test', () => {
  let repository: MemoryNoteRepository;

  const evaluation1 = new Id().id;
  const evaluation2 = new Id().id;
  const evaluation3 = new Id().id;
  const student1 = new Id().id;
  const student2 = new Id().id;
  const student3 = new Id().id;
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
    it('should received an undefined', async () => {
      const noteId = new Id().id;
      const noteFound = await repository.find(noteId);

      expect(noteFound).toBeUndefined;
    });
    it('should throw an error when the Id is wrong', async () => {
      const note = new Note({
        id: new Id(),
        evaluation: evaluation3,
        student: student3,
        note: noteValue3,
      });

      await expect(repository.update(note)).rejects.toThrow('Note not found');
    });
    it('should generate an error when trying to remove the note with the wrong ID', async () => {
      await expect(repository.delete(new Id().id)).rejects.toThrow(
        'Note not found'
      );
    });
  });

  describe('On success', () => {
    it('should find a note', async () => {
      const noteId = note1.id.id;
      const noteFound = await repository.find(noteId);

      expect(noteFound).toBeDefined;
      //@ts-expect-error
      expect(noteFound.id).toBeUndefined;
      expect(noteFound!.evaluation).toBe(note1.evaluation);
      expect(noteFound!.student).toBe(note1.student);
      expect(noteFound!.note).toBe(note1.note);
    });
    it('should create a new note and return its id', async () => {
      const result = await repository.create(note3);

      expect(result).toBe(note3.id.id);
    });
    it('should update a note and return its new informations', async () => {
      const updatedNote: Note = note2;
      updatedNote.evaluation = new Id().id;

      const result = await repository.update(updatedNote);

      expect(result).toEqual(updatedNote);
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
    it('should remove the note', async () => {
      const response = await repository.delete(note1.id.id);

      expect(response).toBe('Operação concluída com sucesso');
    });
  });
});
