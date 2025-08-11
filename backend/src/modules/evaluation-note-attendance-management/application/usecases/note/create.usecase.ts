import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import {
  CreateNoteInputDto,
  CreateNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/application/gateway/note.gateway';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  FunctionCalledEnum,
  ModulesNameEnum,
} from '@/modules/@shared/enums/enums';

/**
 * Use case responsible for creating a new note.
 *
 * Checks for id uniqueness and persists the note in the repository.
 */
export default class CreateNote
  implements UseCaseInterface<CreateNoteInputDto, CreateNoteOutputDto>
{
  /** Repository for persisting and retrieving notes */
  private readonly _noteRepository: NoteGateway;

  /**
   * Constructs a new instance of the CreateNote use case.
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
   * Executes the creation of a new note.
   *
   * @param input - Input data including evaluation, note, and student
   * @returns Output data of the created note
   * @throws Error if a note with the same id already exists
   */
  async execute(
    { evaluation, note, student }: CreateNoteInputDto,
    token?: TokenData
  ): Promise<CreateNoteOutputDto> {
    await this.policiesService.verifyPolicies(
      ModulesNameEnum.NOTE,
      FunctionCalledEnum.CREATE,
      token
    );

    const noteInstance = new Note({
      evaluation,
      note,
      student,
    });

    const noteVerification = await this._noteRepository.find(
      noteInstance.id.value
    );
    if (noteVerification) throw new Error('Note already exists');

    const result = await this._noteRepository.create(noteInstance);

    return { id: result };
  }
}
