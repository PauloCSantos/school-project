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
} from '../../dto/note-facade.dto';
import CreateNote from '../../usecases/note/createNote.usecase';
import DeleteNote from '../../usecases/note/deleteNote.usecase';
import FindAllNote from '../../usecases/note/findAllNote.usecase';
import FindNote from '../../usecases/note/findNote.usecase';
import UpdateNote from '../../usecases/note/updateNote.usecase';
import NoteFacadeInterface from '../interface/note-facade.interface';

type NoteFacadeProps = {
  createNote: CreateNote;
  deleteNote: DeleteNote;
  findAllNote: FindAllNote;
  findNote: FindNote;
  updateNote: UpdateNote;
};
export default class NoteFacade implements NoteFacadeInterface {
  private _createNote: CreateNote;
  private _deleteNote: DeleteNote;
  private _findAllNote: FindAllNote;
  private _findNote: FindNote;
  private _updateNote: UpdateNote;

  constructor(input: NoteFacadeProps) {
    this._createNote = input.createNote;
    this._deleteNote = input.deleteNote;
    this._findAllNote = input.findAllNote;
    this._findNote = input.findNote;
    this._updateNote = input.updateNote;
  }

  async create(input: CreateNoteInputDto): Promise<CreateNoteOutputDto> {
    return await this._createNote.execute(input);
  }
  async find(input: FindNoteInputDto): Promise<FindNoteOutputDto | undefined> {
    return await this._findNote.execute(input);
  }
  async findAll(input: FindAllNoteInputDto): Promise<FindAllNoteOutputDto> {
    return await this._findAllNote.execute(input);
  }
  async delete(input: DeleteNoteInputDto): Promise<DeleteNoteOutputDto> {
    return await this._deleteNote.execute(input);
  }
  async update(input: UpdateNoteInputDto): Promise<UpdateNoteOutputDto> {
    return await this._updateNote.execute(input);
  }
}
