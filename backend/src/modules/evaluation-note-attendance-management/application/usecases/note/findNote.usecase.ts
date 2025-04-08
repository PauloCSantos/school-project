import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  FindNoteInputDto,
  FindNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';

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
        id: response.id.value,
        evaluation: response.evaluation,
        note: response.note,
        student: response.student,
      };
    } else {
      return response;
    }
  }
}
