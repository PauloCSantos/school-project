import {
  CreateNoteInputDto,
  CreateNoteOutputDto,
  DeleteNoteInputDto,
  DeleteNoteOutputDto,
  FindAllNoteInputDto,
  FindAllNoteOutputDto,
  FindNoteInputDto,
  FindNoteOutputDto,
  UpdateNoteInputDto,
  UpdateNoteOutputDto,
} from '../../application/dto/note-usecase.dto';
import CreateNote from '../../application/usecases/note/create.usecase';
import DeleteNote from '../../application/usecases/note/delete.usecase';
import FindAllNote from '../../application/usecases/note/find-all.usecase';
import FindNote from '../../application/usecases/note/find.usecase';
import UpdateNote from '../../application/usecases/note/update.usecase';

/**
 * Controller for note management operations.
 * Handles HTTP requests by delegating to appropriate use cases.
 */
export default class NoteController {
  /**
   * Creates a new NoteController instance.
   * @param createNote - Use case for creating a new note
   * @param findNote - Use case for finding a note
   * @param findAllNote - Use case for finding all notes
   * @param updateNote - Use case for updating a note
   * @param deleteNote - Use case for deleting a note
   */
  constructor(
    private readonly createNote: CreateNote,
    private readonly findNote: FindNote,
    private readonly findAllNote: FindAllNote,
    private readonly updateNote: UpdateNote,
    private readonly deleteNote: DeleteNote
  ) {}

  /**
   * Creates a new note.
   * @param input - The data for creating a new note
   * @returns Promise resolving to the created note data
   */
  async create(input: CreateNoteInputDto): Promise<CreateNoteOutputDto> {
    const response = await this.createNote.execute(input);
    return response;
  }

  /**
   * Finds a note by id.
   * @param input - The input containing the id to search for
   * @returns Promise resolving to the found note data or null
   */
  async find(input: FindNoteInputDto): Promise<FindNoteOutputDto | null> {
    const response = await this.findNote.execute(input);
    return response;
  }

  /**
   * Finds all notes based on provided criteria.
   * @param input - The criteria for finding notes
   * @returns Promise resolving to the found note records
   */
  async findAll(input: FindAllNoteInputDto): Promise<FindAllNoteOutputDto> {
    const response = await this.findAllNote.execute(input);
    return response;
  }

  /**
   * Updates a note.
   * @param input - The input containing the note data to update
   * @returns Promise resolving to the updated note data
   */
  async update(input: UpdateNoteInputDto): Promise<UpdateNoteOutputDto> {
    const response = await this.updateNote.execute(input);
    return response;
  }

  /**
   * Deletes a note.
   * @param input - The input containing the id of the note to delete
   * @returns Promise resolving to the deletion confirmation
   */
  async delete(input: DeleteNoteInputDto): Promise<DeleteNoteOutputDto> {
    const response = await this.deleteNote.execute(input);
    return response;
  }
}
