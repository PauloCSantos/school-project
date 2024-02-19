import {
  UpdateNoteInputDto,
  UpdateNoteOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/note-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import NoteGateway from '@/infraestructure/gateway/evaluation-note-attendance-management/note.gateway';

export default class UpdateNote
  implements UseCaseInterface<UpdateNoteInputDto, UpdateNoteOutputDto>
{
  private _noteRepository: NoteGateway;

  constructor(noteRepository: NoteGateway) {
    this._noteRepository = noteRepository;
  }
  async execute({
    id,
    evaluation,
    note,
    student,
  }: UpdateNoteInputDto): Promise<UpdateNoteOutputDto> {
    const noteInstance = await this._noteRepository.find(id);
    if (!noteInstance) throw new Error('Note not found');
    try {
      evaluation !== undefined && (noteInstance.evaluation = evaluation);
      note !== undefined && (noteInstance.note = note);
      student !== undefined && (noteInstance.student = student);

      const result = await this._noteRepository.update(noteInstance);

      return {
        evaluation: result.evaluation,
        note: result.note,
        student: result.student,
      };
    } catch (error) {
      throw error;
    }
  }
}
