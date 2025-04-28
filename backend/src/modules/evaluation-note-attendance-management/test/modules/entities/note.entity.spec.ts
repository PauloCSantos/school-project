import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';

describe('Note unit test', () => {
  const baseNoteData = {
    evaluation: new Id().value,
    student: new Id().value,
    note: 8.5,
  };

  let note: Note;

  beforeEach(() => {
    note = new Note({ ...baseNoteData });
  });

  describe('Failure cases', () => {
    it('should throw an error when input is missing required fields', () => {
      //@ts-expect-error
      expect(() => new Note({})).toThrow('All note fields are mandatory');
    });

    it('should throw an error when id is invalid', () => {
      expect(() => {
        new Note({ ...baseNoteData, id: 'invalid-id' as any });
      }).toThrow('Invalid id');
    });

    it('should throw an error when evaluation id is invalid', () => {
      expect(() => {
        new Note({ ...baseNoteData, evaluation: 'invalid-id' });
      }).toThrow('Evaluation id is not valid');
    });

    it('should throw an error when student id is invalid', () => {
      expect(() => {
        new Note({ ...baseNoteData, student: 'invalid-id' });
      }).toThrow('Student id is not valid');
    });

    it('should throw an error when note is not numeric', () => {
      expect(() => {
        new Note({ ...baseNoteData, note: 'excellent' as any });
      }).toThrow('The note field must be numeric and between 0 and 10');
    });

    it('should throw an error when note is negative', () => {
      expect(() => {
        new Note({ ...baseNoteData, note: -1 });
      }).toThrow('The note field must be numeric and between 0 and 10');
    });

    it('should throw an error when note is greater than 10', () => {
      expect(() => {
        new Note({ ...baseNoteData, note: 10.5 });
      }).toThrow('The note field must be numeric and between 0 and 10');
    });

    it('should throw an error when setting an invalid evaluation id after creation', () => {
      expect(() => {
        note.evaluation = 'invalid-id';
      }).toThrow('Evaluation id is not valid');
    });

    it('should throw an error when setting an invalid student id after creation', () => {
      expect(() => {
        note.student = 'invalid-id';
      }).toThrow('Student id is not valid');
    });

    it('should throw an error when setting an invalid note value after creation', () => {
      expect(() => {
        note.note = 12;
      }).toThrow('The note field must be numeric and between 0 and 10');
    });
  });

  describe('Success cases', () => {
    it('should create a valid Note instance', () => {
      expect(note).toBeInstanceOf(Note);
      expect(note.evaluation).toBe(baseNoteData.evaluation);
      expect(note.student).toBe(baseNoteData.student);
      expect(note.note).toBe(baseNoteData.note);
    });

    it('should create a Note with a provided id', () => {
      const id = new Id();
      const noteWithId = new Note({ ...baseNoteData, id });

      expect(noteWithId.id).toBe(id);
    });

    it('should allow updating evaluation with valid id', () => {
      const newEvaluationId = new Id().value;
      note.evaluation = newEvaluationId;
      expect(note.evaluation).toBe(newEvaluationId);
    });

    it('should allow updating student with valid id', () => {
      const newStudentId = new Id().value;
      note.student = newStudentId;
      expect(note.student).toBe(newStudentId);
    });

    it('should allow updating note with valid value', () => {
      note.note = 9.5;
      expect(note.note).toBe(9.5);
    });

    it('should allow note to be 0', () => {
      note.note = 0;
      expect(note.note).toBe(0);
    });

    it('should allow note to be 10', () => {
      note.note = 10;
      expect(note.note).toBe(10);
    });

    it('should correctly handle decimal note values', () => {
      note.note = 7.25;
      expect(note.note).toBe(7.25);
    });
  });
});
