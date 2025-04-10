import {
  CreateSubjectInputDto,
  CreateSubjectOutputDto,
  DeleteSubjectInputDto,
  DeleteSubjectOutputDto,
  FindAllSubjectInputDto,
  FindAllSubjectOutputDto,
  FindSubjectInputDto,
  FindSubjectOutputDto,
  UpdateSubjectInputDto,
  UpdateSubjectOutputDto,
} from '../../application/dto/subject-usecase.dto';
import CreateSubject from '../../application/usecases/subject/create.usecase';
import DeleteSubject from '../../application/usecases/subject/delete.usecase';
import FindAllSubject from '../../application/usecases/subject/find-all.usecase';
import FindSubject from '../../application/usecases/subject/find.usecase';
import UpdateSubject from '../../application/usecases/subject/update.usecase';

export class SubjectController {
  constructor(
    private readonly createSubject: CreateSubject,
    private readonly findSubject: FindSubject,
    private readonly findAllSubject: FindAllSubject,
    private readonly updateSubject: UpdateSubject,
    private readonly deleteSubject: DeleteSubject
  ) {}

  async create(input: CreateSubjectInputDto): Promise<CreateSubjectOutputDto> {
    const response = await this.createSubject.execute(input);
    return response;
  }
  async find(
    input: FindSubjectInputDto
  ): Promise<FindSubjectOutputDto | undefined> {
    const response = await this.findSubject.execute(input);
    return response;
  }
  async findAll(
    input: FindAllSubjectInputDto
  ): Promise<FindAllSubjectOutputDto> {
    const response = await this.findAllSubject.execute(input);
    return response;
  }
  async delete(input: DeleteSubjectInputDto): Promise<DeleteSubjectOutputDto> {
    const response = await this.deleteSubject.execute(input);
    return response;
  }
  async update(input: UpdateSubjectInputDto): Promise<UpdateSubjectOutputDto> {
    const response = await this.updateSubject.execute(input);
    return response;
  }
}
