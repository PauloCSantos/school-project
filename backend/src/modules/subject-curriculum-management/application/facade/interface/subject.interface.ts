import { TokenData } from '@/modules/@shared/type/sharedTypes';
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
  create(
    input: CreateSubjectInputDto,
    token: TokenData
  ): Promise<CreateSubjectOutputDto>;
  find(
    input: FindSubjectInputDto,
    token: TokenData
  ): Promise<FindSubjectOutputDto | null>;
  findAll(
    input: FindAllSubjectInputDto,
    token: TokenData
  ): Promise<FindAllSubjectOutputDto>;
  delete(
    input: DeleteSubjectInputDto,
    token: TokenData
  ): Promise<DeleteSubjectOutputDto>;
  update(
    input: UpdateSubjectInputDto,
    token: TokenData
  ): Promise<UpdateSubjectOutputDto>;
}
