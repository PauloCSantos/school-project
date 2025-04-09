import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import {
  CreateNoteInputDto,
  CreateNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';

export default class CreateNote
  implements UseCaseInterface<CreateNoteInputDto, CreateNoteOutputDto>
{
  private _noteRepository: NoteGateway;

  constructor(noteRepository: NoteGateway) {
    this._noteRepository = noteRepository;
  }
  async execute({
    evaluation,
    note,
    student,
  }: CreateNoteInputDto): Promise<CreateNoteOutputDto> {
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
