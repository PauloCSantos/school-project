import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindAllNoteInputDto,
  FindAllNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';

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
      id: note.id.value,
      evaluation: note.evaluation,
      note: note.note,
      student: note.student,
    }));

    return result;
  }
}
