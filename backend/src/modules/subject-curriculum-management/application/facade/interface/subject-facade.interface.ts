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
} from '../../dto/subject-facade.dto';

export default interface SubjectFacadeInterface {
  create(input: CreateSubjectInputDto): Promise<CreateSubjectOutputDto>;
  find(input: FindSubjectInputDto): Promise<FindSubjectOutputDto | undefined>;
  findAll(input: FindAllSubjectInputDto): Promise<FindAllSubjectOutputDto>;
  delete(input: DeleteSubjectInputDto): Promise<DeleteSubjectOutputDto>;
  update(input: UpdateSubjectInputDto): Promise<UpdateSubjectOutputDto>;
}
