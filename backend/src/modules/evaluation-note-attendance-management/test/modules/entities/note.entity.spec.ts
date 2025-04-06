import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';

describe('Note unit test', () => {
  const noteData = {
    id: new Id(),
    evaluation: new Id().id,
    student: new Id().id,
    note: 8.5,
  };

  describe('On fail', () => {
    it('should throw error when the input have missing values', () => {
      //@ts-expect-error
      expect(() => new Note({})).toThrow('All note fields are mandatory');
    });
    it('should throw error when setting an invalid note', () => {
      const note = new Note(noteData);

      expect(() => {
        note.note = 14;
      }).toThrow('The note field must be numeric and between 0 and 10');
    });
  });

  describe('On success', () => {
    it('Should create a note with valid input', () => {
      const note = new Note(noteData);

      expect(note).toBeInstanceOf(Note);
      expect(note.id).toBe(noteData.id);
      expect(note.evaluation).toBe(noteData.evaluation);
      expect(note.student).toBe(noteData.student);
      expect(note.note).toBe(noteData.note);
    });
    it('Should update values', () => {
      const noteInstance = new Note(noteData);
      noteInstance.note = 9.0;

      expect(noteInstance.note).toBe(9.0);
    });
  });
});
