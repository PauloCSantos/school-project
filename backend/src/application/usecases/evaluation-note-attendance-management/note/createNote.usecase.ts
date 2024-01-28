import {
  CreateNoteInputDto,
  CreateNoteOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/note-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import NoteGateway from '@/modules/evaluation-note-attendance-management/note/gateway/note.gateway';
import Note from '@/modules/evaluation-note-attendance-management/note/domain/entity/note.entity';

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
      noteInstance.id.id
    );
    if (noteVerification) throw new Error('Note already exists');

    const result = await this._noteRepository.create(noteInstance);

    return { id: result };
  }
}
