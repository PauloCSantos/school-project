import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindNoteInputDto,
  FindNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/application/gateway/note.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';
import { NoteMapper } from '@/modules/evaluation-note-attendance-management/infrastructure/mapper/note.mapper';

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
  constructor(
    noteRepository: NoteGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._noteRepository = noteRepository;
  }

  /**
   * Executes the search for a note by id.
   *
   * @param input - Input data containing the id to search for
   * @returns Note data if found, null otherwise
   */
  async execute(
    { id }: FindNoteInputDto,
    token: TokenData
  ): Promise<FindNoteOutputDto | null> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.NOTE,
      FunctionCalledEnum.FIND,
      token
    );

    const response = await this._noteRepository.find(token.masterId, id);

    if (response) {
      return NoteMapper.toObj(response)
    }

    return null;
  }
}
