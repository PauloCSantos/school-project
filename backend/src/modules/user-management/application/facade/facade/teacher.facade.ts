import CreateUserTeacher from '../../usecases/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '../../usecases/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '../../usecases/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '../../usecases/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '../../usecases/teacher/updateUserTeacher.usecase';
import TeacherFacadeInterface from '../interface/teacher-facade.interface';
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
} from '../../dto/teacher-facade.dto';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

type TeacherFacadeProps = {
  readonly createUserTeacher: CreateUserTeacher;
  readonly deleteUserTeacher: DeleteUserTeacher;
  readonly findAllUserTeacher: FindAllUserTeacher;
  readonly findUserTeacher: FindUserTeacher;
  readonly updateUserTeacher: UpdateUserTeacher;
  readonly policiesService: PoliciesServiceInterface;
};
export default class TeacherFacade implements TeacherFacadeInterface {
  private readonly _createUserTeacher: CreateUserTeacher;
  private readonly _deleteUserTeacher: DeleteUserTeacher;
  private readonly _findAllUserTeacher: FindAllUserTeacher;
  private readonly _findUserTeacher: FindUserTeacher;
  private readonly _updateUserTeacher: UpdateUserTeacher;
  private readonly _policiesService: PoliciesServiceInterface;

  constructor(input: TeacherFacadeProps) {
    this._createUserTeacher = input.createUserTeacher;
    this._deleteUserTeacher = input.deleteUserTeacher;
    this._findAllUserTeacher = input.findAllUserTeacher;
    this._findUserTeacher = input.findUserTeacher;
    this._updateUserTeacher = input.updateUserTeacher;
    this._policiesService = input.policiesService;
  }

  async create(
    input: CreateUserTeacherInputDto,
    token: TokenData
  ): Promise<CreateUserTeacherOutputDto> {
    return await this._createUserTeacher.execute(
      input,
      this._policiesService,
      token
    );
  }
  async find(
    input: FindUserTeacherInputDto,
    token: TokenData
  ): Promise<FindUserTeacherOutputDto | null> {
    return await this._findUserTeacher.execute(
      input,
      this._policiesService,
      token
    );
  }
  async findAll(
    input: FindAllUserTeacherInputDto,
    token: TokenData
  ): Promise<FindAllUserTeacherOutputDto> {
    return await this._findAllUserTeacher.execute(
      input,
      this._policiesService,
      token
    );
  }
  async delete(
    input: DeleteUserTeacherInputDto,
    token: TokenData
  ): Promise<DeleteUserTeacherOutputDto> {
    return await this._deleteUserTeacher.execute(
      input,
      this._policiesService,
      token
    );
  }
  async update(
    input: UpdateUserTeacherInputDto,
    token: TokenData
  ): Promise<UpdateUserTeacherOutputDto> {
    return await this._updateUserTeacher.execute(
      input,
      this._policiesService,
      token
    );
  }
}
