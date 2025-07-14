import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import {
  CreateUserTeacherInputDto,
  CreateUserTeacherOutputDto,
  DeleteUserTeacherInputDto,
  DeleteUserTeacherOutputDto,
  FindAllUserTeacherInputDto,
  FindAllUserTeacherOutputDto,
  FindUserTeacherInputDto,
  FindUserTeacherOutputDto,
  UpdateUserTeacherInputDto,
  UpdateUserTeacherOutputDto,
} from '../../application/dto/teacher-usecase.dto';
import CreateUserTeacher from '../../application/usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '../../application/usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '../../application/usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '../../application/usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '../../application/usecases/teacher/updateUserTeacher.usecase';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

export class UserTeacherController {
  constructor(
    private readonly createUserTeacher: CreateUserTeacher,
    private readonly findUserTeacher: FindUserTeacher,
    private readonly findAllUserTeacher: FindAllUserTeacher,
    private readonly updateUserTeacher: UpdateUserTeacher,
    private readonly deleteUserTeacher: DeleteUserTeacher,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  async create(
    input: CreateUserTeacherInputDto,
    token: TokenData
  ): Promise<CreateUserTeacherOutputDto> {
    const response = await this.createUserTeacher.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async find(
    input: FindUserTeacherInputDto,
    token: TokenData
  ): Promise<FindUserTeacherOutputDto | null> {
    const response = await this.findUserTeacher.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async findAll(
    input: FindAllUserTeacherInputDto,
    token: TokenData
  ): Promise<FindAllUserTeacherOutputDto> {
    const response = await this.findAllUserTeacher.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async delete(
    input: DeleteUserTeacherInputDto,
    token: TokenData
  ): Promise<DeleteUserTeacherOutputDto> {
    const response = await this.deleteUserTeacher.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async update(
    input: UpdateUserTeacherInputDto,
    token: TokenData
  ): Promise<UpdateUserTeacherOutputDto> {
    const response = await this.updateUserTeacher.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
}
