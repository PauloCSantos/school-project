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
} from '../../dto/note-facade.dto';
import CreateNote from '../../usecases/note/create.usecase';
import DeleteNote from '../../usecases/note/delete.usecase';
import FindAllNote from '../../usecases/note/find-all.usecase';
import FindNote from '../../usecases/note/find.usecase';
import UpdateNote from '../../usecases/note/update.usecase';
import NoteFacadeInterface from '../interface/note.interface';

/**
 * Properties required to initialize the NoteFacade
 */
type NoteFacadeProps = {
  readonly createNote: CreateNote;
  readonly deleteNote: DeleteNote;
  readonly findAllNote: FindAllNote;
  readonly findNote: FindNote;
  readonly updateNote: UpdateNote;
};

/**
 * Facade implementation for note operations
 *
 * This class provides a unified interface to the underlying note
 * use cases, simplifying client interaction with the note subsystem.
 */
export default class NoteFacade implements NoteFacadeInterface {
  private readonly _createNote: CreateNote;
  private readonly _deleteNote: DeleteNote;
  private readonly _findAllNote: FindAllNote;
  private readonly _findNote: FindNote;
  private readonly _updateNote: UpdateNote;

  /**
   * Creates a new instance of NoteFacade
   * @param input Dependencies required by the facade
   */
  constructor(input: NoteFacadeProps) {
    this._createNote = input.createNote;
    this._deleteNote = input.deleteNote;
    this._findAllNote = input.findAllNote;
    this._findNote = input.findNote;
    this._updateNote = input.updateNote;
  }

  /**
   * Creates a new note
   * @param input Note creation parameters
   * @returns Information about the created note
   */
  async create(input: CreateNoteInputDto): Promise<CreateNoteOutputDto> {
    return await this._createNote.execute(input);
  }

  /**
   * Finds a note by ID
   * @param input Search parameters
   * @returns Note information if found, null otherwise
   */
  async find(input: FindNoteInputDto): Promise<FindNoteOutputDto | null> {
    // Changed from undefined to null for better semantic meaning
    const result = await this._findNote.execute(input);
    return result || null;
  }

  /**
   * Retrieves all notes based on search criteria
   * @param input Search parameters
   * @returns Collection of note information
   */
  async findAll(input: FindAllNoteInputDto): Promise<FindAllNoteOutputDto> {
    return await this._findAllNote.execute(input);
  }

  /**
   * Deletes a note
   * @param input Note identification
   * @returns Confirmation message
   */
  async delete(input: DeleteNoteInputDto): Promise<DeleteNoteOutputDto> {
    return await this._deleteNote.execute(input);
  }

  /**
   * Updates a note's information
   * @param input Note identification and data to update
   * @returns Updated note information
   */
  async update(input: UpdateNoteInputDto): Promise<UpdateNoteOutputDto> {
    return await this._updateNote.execute(input);
  }
}
