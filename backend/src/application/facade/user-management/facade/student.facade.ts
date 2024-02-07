import CreateUserStudent from '@/application/usecases/user-management/student/createUserStudent.usecase';
import DeleteUserStudent from '@/application/usecases/user-management/student/deleteUserStudent.usecase';
import FindAllUserStudent from '@/application/usecases/user-management/student/findAllUserStudent.usecase';
import FindUserStudent from '@/application/usecases/user-management/student/findUserStudent.usecase';
import UpdateUserStudent from '@/application/usecases/user-management/student/updateUserStudent.usecase';
import StudentFacadeInterface from '../interface/student-facade.interface';
import {
  CreateUserStudentInputDto,
  CreateUserStudentOutputDto,
  DeleteUserStudentInputDto,
  DeleteUserStudentOutputDto,
  FindAllUserStudentInputDto,
  FindAllUserStudentOutputDto,
  FindUserStudentInputDto,
  FindUserStudentOutputDto,
  UpdateUserStudentInputDto,
  UpdateUserStudentOutputDto,
} from '@/application/dto/user-management/student-facade.dto';

type StudentFacadeProps = {
  createUserStudent: CreateUserStudent;
  deleteUserStudent: DeleteUserStudent;
  findAllUserStudent: FindAllUserStudent;
  findUserStudent: FindUserStudent;
  updateUserStudent: UpdateUserStudent;
};
export default class StudentFacade implements StudentFacadeInterface {
  private _createUserStudent: CreateUserStudent;
  private _deleteUserStudent: DeleteUserStudent;
  private _findAllUserStudent: FindAllUserStudent;
  private _findUserStudent: FindUserStudent;
  private _updateUserStudent: UpdateUserStudent;

  constructor(input: StudentFacadeProps) {
    this._createUserStudent = input.createUserStudent;
    this._deleteUserStudent = input.deleteUserStudent;
    this._findAllUserStudent = input.findAllUserStudent;
    this._findUserStudent = input.findUserStudent;
    this._updateUserStudent = input.updateUserStudent;
  }

  async create(
    input: CreateUserStudentInputDto
  ): Promise<CreateUserStudentOutputDto> {
    return await this._createUserStudent.execute(input);
  }
  async find(
    input: FindUserStudentInputDto
  ): Promise<FindUserStudentOutputDto | undefined> {
    return await this._findUserStudent.execute(input);
  }
  async findAll(
    input: FindAllUserStudentInputDto
  ): Promise<FindAllUserStudentOutputDto> {
    return await this._findAllUserStudent.execute(input);
  }
  async delete(
    input: DeleteUserStudentInputDto
  ): Promise<DeleteUserStudentOutputDto> {
    return await this._deleteUserStudent.execute(input);
  }
  async update(
    input: UpdateUserStudentInputDto
  ): Promise<UpdateUserStudentOutputDto> {
    return await this._updateUserStudent.execute(input);
  }
}
