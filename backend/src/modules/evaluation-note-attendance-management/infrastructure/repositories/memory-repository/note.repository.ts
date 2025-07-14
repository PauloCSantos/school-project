import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import NoteGateway from '../../gateway/note.gateway';

/**
 * In-memory implementation of NoteGateway.
 * Stores and manipulates student notes in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryNoteRepository implements NoteGateway {
  private _note: Note[];

  /**
   * Creates a new in-memory repository.
   * @param notes - Optional initial array of student notes
   */
  constructor(notes?: Note[]) {
    notes ? (this._note = notes) : (this._note = []);
  }

  /**
   * Finds a note by its unique identifier.
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Note or null if not found
   */
  async find(id: string): Promise<Note | null> {
    const note = this._note.find(note => note.id.value === id);
    if (note) {
      return note;
    } else {
      return null;
    }
  }

  /**
   * Retrieves a collection of notes with pagination support.
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of Note entities
   */
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Note[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const notes = this._note.slice(offS, qtd);

    return notes;
  }

  /**
   * Creates a new note in memory.
   * @param note - The note entity to be created
   * @returns Promise resolving to the unique identifier of the created note
   */
  async create(note: Note): Promise<string> {
    this._note.push(note);
    return note.id.value;
  }

  /**
   * Updates an existing note identified by its ID.
   * @param note - The note entity with updated information
   * @returns Promise resolving to the updated Note entity
   * @throws Error if the note is not found
   */
  async update(note: Note): Promise<Note> {
    const noteIndex = this._note.findIndex(
      dbNote => dbNote.id.value === note.id.value
    );
    if (noteIndex !== -1) {
      return (this._note[noteIndex] = note);
    } else {
      throw new Error('Note not found');
    }
  }

  /**
   * Deletes a note by its unique identifier.
   * @param id - The unique identifier of the note to delete
   * @returns Promise resolving to a success message
   * @throws Error if the note is not found
   */
  async delete(id: string): Promise<string> {
    const noteIndex = this._note.findIndex(dbNote => dbNote.id.value === id);
    if (noteIndex !== -1) {
      this._note.splice(noteIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Note not found');
    }
  }
}
