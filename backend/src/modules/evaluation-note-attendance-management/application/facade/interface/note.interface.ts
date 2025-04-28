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

/**
 * Interface for note operations
 *
 * Provides methods for CRUD operations on notes
 */
export default interface NoteFacadeInterface {
  /**
   * Creates a new note
   * @param input Note creation parameters
   * @returns Information about the created note
   */
  create(input: CreateNoteInputDto): Promise<CreateNoteOutputDto>;

  /**
   * Finds a note by its identifier
   * @param input Search parameters
   * @returns Note information if found, null otherwise
   */
  find(input: FindNoteInputDto): Promise<FindNoteOutputDto | null>;

  /**
   * Retrieves all notes matching filter criteria
   * @param input Filter parameters
   * @returns List of notes
   */
  findAll(input: FindAllNoteInputDto): Promise<FindAllNoteOutputDto>;

  /**
   * Deletes a note
   * @param input Note identification
   * @returns Confirmation message
   */
  delete(input: DeleteNoteInputDto): Promise<DeleteNoteOutputDto>;

  /**
   * Updates a note's information
   * @param input Note identification and data to update
   * @returns Updated note information
   */
  update(input: UpdateNoteInputDto): Promise<UpdateNoteOutputDto>;
}
