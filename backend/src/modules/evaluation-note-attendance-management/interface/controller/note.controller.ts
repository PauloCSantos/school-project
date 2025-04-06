import {
  CreateNoteInputDto,
  CreateNoteOutputDto,
  DeleteNoteInputDto,
  DeleteNoteOutputDto,
  FindAllNoteInputDto,
  FindAllNoteOutputDto,
  FindNoteInputDto,
  FindNoteOutputDto,
  UpdateNoteInputDto,
  UpdateNoteOutputDto,
} from '../../application/dto/note-usecase.dto';
import CreateNote from '../../application/usecases/note/createNote.usecase';
import DeleteNote from '../../application/usecases/note/deleteNote.usecase';
import FindAllNote from '../../application/usecases/note/findAllNote.usecase';
import FindNote from '../../application/usecases/note/findNote.usecase';
import UpdateNote from '../../application/usecases/note/updateNote.usecase';

export class NoteController {
  constructor(
    private readonly createNote: CreateNote,
    private readonly findNote: FindNote,
    private readonly findAllNote: FindAllNote,
    private readonly updateNote: UpdateNote,
    private readonly deleteNote: DeleteNote
  ) {}

  async create(input: CreateNoteInputDto): Promise<CreateNoteOutputDto> {
    const response = await this.createNote.execute(input);
    return response;
  }
  async find(input: FindNoteInputDto): Promise<FindNoteOutputDto | undefined> {
    const response = await this.findNote.execute(input);
    return response;
  }
  async findAll(input: FindAllNoteInputDto): Promise<FindAllNoteOutputDto> {
    const response = await this.findAllNote.execute(input);
    return response;
  }
  async delete(input: DeleteNoteInputDto): Promise<DeleteNoteOutputDto> {
    const response = await this.deleteNote.execute(input);
    return response;
  }
  async update(input: UpdateNoteInputDto): Promise<UpdateNoteOutputDto> {
    const response = await this.updateNote.execute(input);
    return response;
  }
}
