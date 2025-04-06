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

type TeacherFacadeProps = {
  createUserTeacher: CreateUserTeacher;
  deleteUserTeacher: DeleteUserTeacher;
  findAllUserTeacher: FindAllUserTeacher;
  findUserTeacher: FindUserTeacher;
  updateUserTeacher: UpdateUserTeacher;
};
export default class TeacherFacade implements TeacherFacadeInterface {
  private _createUserTeacher: CreateUserTeacher;
  private _deleteUserTeacher: DeleteUserTeacher;
  private _findAllUserTeacher: FindAllUserTeacher;
  private _findUserTeacher: FindUserTeacher;
  private _updateUserTeacher: UpdateUserTeacher;

  constructor(input: TeacherFacadeProps) {
    this._createUserTeacher = input.createUserTeacher;
    this._deleteUserTeacher = input.deleteUserTeacher;
    this._findAllUserTeacher = input.findAllUserTeacher;
    this._findUserTeacher = input.findUserTeacher;
    this._updateUserTeacher = input.updateUserTeacher;
  }

  async create(
    input: CreateUserTeacherInputDto
  ): Promise<CreateUserTeacherOutputDto> {
    return await this._createUserTeacher.execute(input);
  }
  async find(
    input: FindUserTeacherInputDto
  ): Promise<FindUserTeacherOutputDto | undefined> {
    return await this._findUserTeacher.execute(input);
  }
  async findAll(
    input: FindAllUserTeacherInputDto
  ): Promise<FindAllUserTeacherOutputDto> {
    return await this._findAllUserTeacher.execute(input);
  }
  async delete(
    input: DeleteUserTeacherInputDto
  ): Promise<DeleteUserTeacherOutputDto> {
    return await this._deleteUserTeacher.execute(input);
  }
  async update(
    input: UpdateUserTeacherInputDto
  ): Promise<UpdateUserTeacherOutputDto> {
    return await this._updateUserTeacher.execute(input);
  }
}
