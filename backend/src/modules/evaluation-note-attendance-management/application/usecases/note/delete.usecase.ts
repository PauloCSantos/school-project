import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteNoteInputDto,
  DeleteNoteOutputDto,
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
 * Use case responsible for deleting a note.
 *
 * Verifies note existence before proceeding with deletion.
 */
export default class DeleteNote
  implements UseCaseInterface<DeleteNoteInputDto, DeleteNoteOutputDto>
{
  /** Repository for persisting and retrieving notes */
  private readonly _noteRepository: NoteGateway;

  /**
   * Constructs a new instance of the DeleteNote use case.
   *
   * @param noteRepository - Gateway implementation for data persistence
   */
  constructor(noteRepository: NoteGateway) {
    this._noteRepository = noteRepository;
  }

  /**
   * Executes the deletion of a note.
   *
   * @param input - Input data containing the id of the note to delete
   * @returns Output data with the result message
   * @throws Error if the note with the specified id does not exist
   */
  async execute(
    { id }: DeleteNoteInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<DeleteNoteOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.NOTE,
        FunctionCalledEnum.DELETE,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }

    const noteVerification = await this._noteRepository.find(id);
    if (!noteVerification) throw new Error('Note not found');

    const result = await this._noteRepository.delete(id);

    return { message: result };
  }
}
