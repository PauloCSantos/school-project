import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllNoteInputDto,
  FindAllNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';

/**
 * Use case responsible for retrieving all notes with pagination.
 *
 * Retrieves notes from the repository and maps them to the appropriate output format.
 */
export default class FindAllNote
  implements UseCaseInterface<FindAllNoteInputDto, FindAllNoteOutputDto>
{
  /** Repository for persisting and retrieving notes */
  private readonly _noteRepository: NoteGateway;

  /**
   * Constructs a new instance of the FindAllNote use case.
   *
   * @param noteRepository - Gateway implementation for data persistence
   */
  constructor(noteRepository: NoteGateway) {
    this._noteRepository = noteRepository;
  }

  /**
   * Executes the retrieval of all notes with pagination.
   *
   * @param input - Input data containing pagination parameters
   * @returns Array of note data
   */
  async execute({
    offset,
    quantity,
  }: FindAllNoteInputDto): Promise<FindAllNoteOutputDto> {
    const results = await this._noteRepository.findAll(offset, quantity);

    const result = results.map(note => ({
      id: note.id.value,
      evaluation: note.evaluation,
      note: note.note,
      student: note.student,
    }));

    return result;
  }
}
