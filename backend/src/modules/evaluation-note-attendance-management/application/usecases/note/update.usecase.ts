import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateNoteInputDto,
  UpdateNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  ErrorMessage,
  FunctionCalledEnum,
  ModulesNameEnum,
  TokenData,
} from '@/modules/@shared/type/sharedTypes';

/**
 * Use case responsible for updating a note.
 *
 * Verifies note existence, applies updates, and persists changes.
 */
export default class UpdateNote
  implements UseCaseInterface<UpdateNoteInputDto, UpdateNoteOutputDto>
{
  /** Repository for persisting and retrieving notes */
  private readonly _noteRepository: NoteGateway;

  /**
   * Constructs a new instance of the UpdateNote use case.
   *
   * @param noteRepository - Gateway implementation for data persistence
   */
  constructor(noteRepository: NoteGateway) {
    this._noteRepository = noteRepository;
  }

  /**
   * Executes the update of a note.
   *
   * @param input - Input data containing the note id and fields to update
   * @returns Output data of the updated note
   * @throws Error if the note with the specified id does not exist
   */
  async execute(
    { id, evaluation, note, student }: UpdateNoteInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<UpdateNoteOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.NOTE,
        FunctionCalledEnum.DELETE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const noteInstance = await this._noteRepository.find(id);
    if (!noteInstance) throw new Error('Note not found');

    try {
      evaluation !== undefined && (noteInstance.evaluation = evaluation);
      note !== undefined && (noteInstance.note = note);
      student !== undefined && (noteInstance.student = student);

      const result = await this._noteRepository.update(noteInstance);

      return {
        id: result.id.value,
        evaluation: result.evaluation,
        note: result.note,
        student: result.student,
      };
    } catch (error) {
      throw error;
    }
  }
}
