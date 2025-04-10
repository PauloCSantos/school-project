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

export default interface NoteFacadeInterface {
  create(input: CreateNoteInputDto): Promise<CreateNoteOutputDto>;
  find(input: FindNoteInputDto): Promise<FindNoteOutputDto | undefined>;
  findAll(input: FindAllNoteInputDto): Promise<FindAllNoteOutputDto>;
  delete(input: DeleteNoteInputDto): Promise<DeleteNoteOutputDto>;
  update(input: UpdateNoteInputDto): Promise<UpdateNoteOutputDto>;
}
