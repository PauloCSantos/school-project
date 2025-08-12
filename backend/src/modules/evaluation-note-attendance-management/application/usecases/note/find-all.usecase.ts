import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllNoteInputDto,
  FindAllNoteOutputDto,
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
  constructor(
    noteRepository: NoteGateway,
    private readonly policiesService: PoliciesServiceInterface
  ) {
    this._noteRepository = noteRepository;
  }

  /**
   * Executes the retrieval of all notes with pagination.
   *
   * @param input - Input data containing pagination parameters
   * @returns Array of note data
   */
  async execute(
    { offset, quantity }: FindAllNoteInputDto,
    token: TokenData
  ): Promise<FindAllNoteOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.NOTE,
      FunctionCalledEnum.FIND_ALL,
      token
    );
    const results = await this._noteRepository.findAll(token.masterId, quantity, offset);

    return NoteMapper.toObjList(results)
  }
}
