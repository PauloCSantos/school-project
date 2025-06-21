import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindNoteInputDto,
  FindNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';

/**
 * Use case responsible for finding a note by id.
 *
 * Retrieves note information from the repository and maps it to the appropriate output format.
 */
export default class FindNote
  implements UseCaseInterface<FindNoteInputDto, FindNoteOutputDto | null>
{
  /** Repository for persisting and retrieving notes */
  private readonly _noteRepository: NoteGateway;

  /**
   * Constructs a new instance of the FindNote use case.
   *
   * @param noteRepository - Gateway implementation for data persistence
   */
  constructor(noteRepository: NoteGateway) {
    this._noteRepository = noteRepository;
  }

  /**
   * Executes the search for a note by id.
   *
   * @param input - Input data containing the id to search for
   * @returns Note data if found, null otherwise
   */
  async execute({ id }: FindNoteInputDto): Promise<FindNoteOutputDto | null> {
    const response = await this._noteRepository.find(id);

    if (response) {
      return {
        id: response.id.value,
        evaluation: response.evaluation,
        note: response.note,
        student: response.student,
      };
    }

    return null;
  }
}
