import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  UpdateNoteInputDto,
  UpdateNoteOutputDto,
} from '../../dto/note-usecase.dto';
import NoteGateway from '@/modules/evaluation-note-attendance-management/infrastructure/gateway/note.gateway';

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
        id: result.id.value,
        evaluation: result.evaluation,
        note: result.note,
        student: result.student,
      };
    } catch (error) {
      throw error;
    }
  }
}
