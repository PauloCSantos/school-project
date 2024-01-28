import {
  FindAllNoteInputDto,
  FindAllNoteOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/note-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import NoteGateway from '@/modules/evaluation-note-attendance-management/note/gateway/note.gateway';

export default class FindAllNote
  implements UseCaseInterface<FindAllNoteInputDto, FindAllNoteOutputDto>
{
  private _noteRepository: NoteGateway;

  constructor(noteRepository: NoteGateway) {
    this._noteRepository = noteRepository;
  }
  async execute({
    offset,
    quantity,
  }: FindAllNoteInputDto): Promise<FindAllNoteOutputDto> {
    const results = await this._noteRepository.findAll(offset, quantity);

    const result = results.map(note => ({
      evaluation: note.evaluation,
      note: note.note,
      student: note.student,
    }));

    return result;
  }
}
