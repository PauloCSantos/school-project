import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  AddSubjectsInputDto,
  AddSubjectsOutputDto,
  CreateCurriculumInputDto,
  CreateCurriculumOutputDto,
  DeleteCurriculumInputDto,
  DeleteCurriculumOutputDto,
  FindAllCurriculumInputDto,
  FindAllCurriculumOutputDto,
  FindCurriculumInputDto,
  FindCurriculumOutputDto,
  RemoveSubjectsInputDto,
  RemoveSubjectsOutputDto,
  UpdateCurriculumInputDto,
  UpdateCurriculumOutputDto,
} from '../../dto/curriculum-facade.dto';

export default interface CurriculumFacadeInterface {
  create(
    input: CreateCurriculumInputDto,
    token: TokenData
  ): Promise<CreateCurriculumOutputDto>;
  find(
    input: FindCurriculumInputDto,
    token: TokenData
  ): Promise<FindCurriculumOutputDto | null>;
  findAll(
    input: FindAllCurriculumInputDto,
    token: TokenData
  ): Promise<FindAllCurriculumOutputDto>;
  delete(
    input: DeleteCurriculumInputDto,
    token: TokenData
  ): Promise<DeleteCurriculumOutputDto>;
  update(
    input: UpdateCurriculumInputDto,
    token: TokenData
  ): Promise<UpdateCurriculumOutputDto>;
  addSubjects(
    input: AddSubjectsInputDto,
    token: TokenData
  ): Promise<AddSubjectsOutputDto>;
  removeSubjects(
    input: RemoveSubjectsInputDto,
    token: TokenData
  ): Promise<RemoveSubjectsOutputDto>;
}
