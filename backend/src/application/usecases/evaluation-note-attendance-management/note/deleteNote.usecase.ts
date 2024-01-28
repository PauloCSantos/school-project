import {
  DeleteNoteInputDto,
  DeleteNoteOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/note-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import NoteGateway from '@/modules/evaluation-note-attendance-management/note/gateway/note.gateway';

export default class DeleteNote
  implements UseCaseInterface<DeleteNoteInputDto, DeleteNoteOutputDto>
{
  private _noteRepository: NoteGateway;

  constructor(noteRepository: NoteGateway) {
    this._noteRepository = noteRepository;
  }
  async execute({ id }: DeleteNoteInputDto): Promise<DeleteNoteOutputDto> {
    const noteVerification = await this._noteRepository.find(id);
    if (!noteVerification) throw new Error('Note not found');

    const result = await this._noteRepository.delete(id);

    return { message: result };
  }
}
