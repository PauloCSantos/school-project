import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteNoteInputDto,
  DeleteNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/application/gateway/note.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

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
  constructor(
    noteRepository: NoteGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
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
    token: TokenData
  ): Promise<DeleteNoteOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.NOTE,
      FunctionCalledEnum.DELETE,
      token
    );

    const noteVerification = await this._noteRepository.find(token.masterId, id);
    if (!noteVerification) throw new Error('Note not found');

    const result = await this._noteRepository.delete(token.masterId, id);

    return { message: result };
  }
}
