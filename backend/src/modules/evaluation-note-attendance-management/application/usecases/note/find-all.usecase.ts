import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllNoteInputDto,
  FindAllNoteOutputDto,
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
  async execute(
    { offset, quantity }: FindAllNoteInputDto,
    policiesService: PoliciesServiceInterface,
    token?: TokenData
  ): Promise<FindAllNoteOutputDto> {
    if (
      !(await policiesService.verifyPolicies(
        ModulesNameEnum.NOTE,
        FunctionCalledEnum.FIND_ALL,
        token
      ))
    ) {
      throw new Error(ErrorMessage.ACCESS_DENIED);
    }
    const results = await this._noteRepository.findAll(quantity, offset);

    const result = results.map(note => ({
      id: note.id.value,
      evaluation: note.evaluation,
      note: note.note,
      student: note.student,
    }));

    return result;
  }
}
