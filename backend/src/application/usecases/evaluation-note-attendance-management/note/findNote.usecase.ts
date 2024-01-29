import {
  FindNoteInputDto,
  FindNoteOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/note-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import NoteGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/note.gateway';

export default class FindNote
  implements UseCaseInterface<FindNoteInputDto, FindNoteOutputDto | undefined>
{
  private _noteRepository: NoteGateway;

  constructor(noteRepository: NoteGateway) {
    this._noteRepository = noteRepository;
  }
  async execute({
    id,
  }: FindNoteInputDto): Promise<FindNoteOutputDto | undefined> {
    const response = await this._noteRepository.find(id);
    if (response) {
      return {
        evaluation: response.evaluation,
        note: response.note,
        student: response.student,
      };
    } else {
      return response;
    }
  }
}
