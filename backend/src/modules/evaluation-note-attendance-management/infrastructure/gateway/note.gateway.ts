import Note from '../../domain/entity/note.entity';

/**
 * Interface for student note operations.
 * Provides methods to interact with student note data persistence layer.
 */
export default interface NoteGateway {
  /**
   * Finds a note by its unique identifier.
   * @param id - The unique identifier of the note to search for
   * @returns Promise resolving to the found Note or undefined if not found
   */
  find(id: string): Promise<Note | undefined>;

  /**
   * Retrieves a collection of notes with pagination support.
   * @param quantity - Optional limit on the number of records to return
   * @param offSet - Optional number of records to skip for pagination
   * @returns Promise resolving to an array of Note entities
   */
  findAll(quantity?: number, offSet?: number): Promise<Note[]>;

  /**
   * Creates a new student note.
   * @param note - The note entity to be created
   * @returns Promise resolving to the ID of the created note
   */
  create(note: Note): Promise<string>;

  /**
   * Updates an existing note.
   * @param note - The note entity with updated information
   * @returns Promise resolving to the updated Note entity
   */
  update(note: Note): Promise<Note>;

  /**
   * Deletes a note by its unique identifier.
   * @param id - The unique identifier of the note to delete
   * @returns Promise resolving to a success message
   */
  delete(id: string): Promise<string>;
}
