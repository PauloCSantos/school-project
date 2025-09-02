import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import NoteGateway from '../../../application/gateway/note.gateway';
import { NoteMapper, NoteMapperProps } from '../../mapper/note.mapper';
import { NoteNotFoundError } from '@/modules/evaluation-note-attendance-management/application/errors/note-not-found.error';

/**
 * In-memory implementation of NoteGateway.
 * Stores and manipulates note records in memory.
 */
export default class MemoryNoteRepository implements NoteGateway {
  private _notes: Map<string, Map<string, NoteMapperProps>> = new Map();

  /**
 * Creates a new in-memory repository.
 * @param notesRecords - Optional initial array of note records
  Ex.: new MemoryNoteRepository([{ masterId, records: [n1, n2] }])
 */
  constructor(notesRecords?: Array<{ masterId: string; records: Note[] }>) {
    if (notesRecords) {
      for (const { masterId, records } of notesRecords) {
        let notes = this._notes.get(masterId);
        if (!notes) {
          notes = new Map<string, NoteMapperProps>();
          this._notes.set(masterId, notes);
        }
        for (const note of records) {
          notes.set(note.id.value, NoteMapper.toObjRepository(note));
        }
      }
    }
  }

  /**
   * Finds a note record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Note or null if not found
   */
  async find(masterId: string, id: string): Promise<Note | null> {
    const obj = this._notes.get(masterId)?.get(id);
    return obj ? NoteMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of note records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of Note entities
   */
  async findAll(
    masterId: string,
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Note[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const notes = this._notes.get(masterId);
    if (!notes) return [];
    const page = Array.from(notes.values()).slice(offS, offS + qtd);
    return NoteMapper.toInstanceList(page);
  }

  /**
   * Creates a new note record in memory.
   * @param masterId - The tenant unique identifier
   * @param note - The note entity to be created
   * @returns Promise resolving to the unique identifier of the created note record
   */
  async create(masterId: string, note: Note): Promise<string> {
    const notes = this.getOrCreateBucket(masterId);
    notes.set(note.id.value, NoteMapper.toObjRepository(note));
    return note.id.value;
  }

  /**
   * Updates an existing note record identified by its ID.
   * @param masterId - The tenant unique identifier
   * @param note - The note entity with updated information
   * @returns Promise resolving to the updated Note entity
   * @throws Error if the note record is not found
   */
  async update(masterId: string, note: Note): Promise<Note> {
    const notes = this._notes.get(masterId);
    if (!notes || !notes.has(note.id.value)) {
      throw new NoteNotFoundError(note.id.value);
    }
    notes.set(note.id.value, NoteMapper.toObjRepository(note));
    return note;
  }

  /**
   * Deletes a note record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the note record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the note record is not found
   */
  async delete(masterId: string, note: Note): Promise<string> {
    const notes = this._notes.get(masterId);
    if (!notes || !notes.has(note.id.value)) {
      throw new NoteNotFoundError(note.id.value);
    }
    notes.set(note.id.value, NoteMapper.toObjRepository(note));
    return 'Operação concluída com sucesso';
  }

  private getOrCreateBucket(masterId: string): Map<string, NoteMapperProps> {
    let notes = this._notes.get(masterId);
    if (!notes) {
      notes = new Map<string, NoteMapperProps>();
      this._notes.set(masterId, notes);
    }
    return notes;
  }
}
