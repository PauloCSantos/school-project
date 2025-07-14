import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  CreateCurriculumInputDto,
  AddSubjectsInputDto,
  AddSubjectsOutputDto,
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
} from '../../application/dto/curriculum-usecase.dto';
import AddSubjects from '../../application/usecases/curriculum/add-subjects.usecase';
import CreateCurriculum from '../../application/usecases/curriculum/create.usecase';
import DeleteCurriculum from '../../application/usecases/curriculum/delete.usecase';
import FindAllCurriculum from '../../application/usecases/curriculum/find-all.usecase';
import FindCurriculum from '../../application/usecases/curriculum/find.usecase';
import RemoveSubjects from '../../application/usecases/curriculum/remove-subjects.usecase';
import UpdateCurriculum from '../../application/usecases/curriculum/update.usecase';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

export class CurriculumController {
  constructor(
    private readonly createCurriculum: CreateCurriculum,
    private readonly findCurriculum: FindCurriculum,
    private readonly findAllCurriculum: FindAllCurriculum,
    private readonly updateCurriculum: UpdateCurriculum,
    private readonly deleteCurriculum: DeleteCurriculum,
    private readonly addSubjectstoCurriculum: AddSubjects,
    private readonly removeSubjectstoCurriculum: RemoveSubjects,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  async create(
    input: CreateCurriculumInputDto,
    token: TokenData
  ): Promise<CreateCurriculumOutputDto> {
    const response = await this.createCurriculum.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async find(
    input: FindCurriculumInputDto,
    token: TokenData
  ): Promise<FindCurriculumOutputDto | null> {
    const response = await this.findCurriculum.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async findAll(
    input: FindAllCurriculumInputDto,
    token: TokenData
  ): Promise<FindAllCurriculumOutputDto> {
    const response = await this.findAllCurriculum.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async delete(
    input: DeleteCurriculumInputDto,
    token: TokenData
  ): Promise<DeleteCurriculumOutputDto> {
    const response = await this.deleteCurriculum.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async update(
    input: UpdateCurriculumInputDto,
    token: TokenData
  ): Promise<UpdateCurriculumOutputDto> {
    const response = await this.updateCurriculum.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async addSubjects(
    input: AddSubjectsInputDto,
    token: TokenData
  ): Promise<AddSubjectsOutputDto> {
    const response = await this.addSubjectstoCurriculum.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async removeSubjects(
    input: RemoveSubjectsInputDto,
    token: TokenData
  ): Promise<RemoveSubjectsOutputDto> {
    const response = await this.removeSubjectstoCurriculum.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
}
