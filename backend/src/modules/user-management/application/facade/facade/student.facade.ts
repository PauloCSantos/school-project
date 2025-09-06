import CreateUserStudent from '../../usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '../../usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '../../usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '../../usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '../../usecases/student/updateUserStudent.usecase';
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
} from '../../../application/dto/student-facade.dto';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import FindUserStudentByBaseUser from '../../usecases/student/findUserStudentByBaseUser.usecase';

type StudentFacadeProps = {
  readonly createUserStudent: CreateUserStudent;
  readonly deleteUserStudent: DeleteUserStudent;
  readonly findAllUserStudent: FindAllUserStudent;
  readonly findUserStudent: FindUserStudent;
  readonly updateUserStudent: UpdateUserStudent;
  readonly findUserStudentByBaseUser: FindUserStudentByBaseUser;
};
export default class StudentFacade implements StudentFacadeInterface {
  private readonly _createUserStudent: CreateUserStudent;
  private readonly _deleteUserStudent: DeleteUserStudent;
  private readonly _findAllUserStudent: FindAllUserStudent;
  private readonly _findUserStudent: FindUserStudent;
  private readonly _updateUserStudent: UpdateUserStudent;
  private readonly _findUserStudentByBaseUser: FindUserStudentByBaseUser;

  constructor(input: StudentFacadeProps) {
    this._createUserStudent = input.createUserStudent;
    this._deleteUserStudent = input.deleteUserStudent;
    this._findAllUserStudent = input.findAllUserStudent;
    this._findUserStudent = input.findUserStudent;
    this._updateUserStudent = input.updateUserStudent;
    this._findUserStudentByBaseUser = input.findUserStudentByBaseUser;
  }

  async create(
    input: CreateUserStudentInputDto,
    token: TokenData
  ): Promise<CreateUserStudentOutputDto> {
    return await this._createUserStudent.execute(input, token);
  }
  async find(
    input: FindUserStudentInputDto,
    token: TokenData
  ): Promise<FindUserStudentOutputDto | null> {
    return await this._findUserStudent.execute(input, token);
  }
  async findAll(
    input: FindAllUserStudentInputDto,
    token: TokenData
  ): Promise<FindAllUserStudentOutputDto> {
    return await this._findAllUserStudent.execute(input, token);
  }
  async delete(
    input: DeleteUserStudentInputDto,
    token: TokenData
  ): Promise<DeleteUserStudentOutputDto> {
    return await this._deleteUserStudent.execute(input, token);
  }
  async update(
    input: UpdateUserStudentInputDto,
    token: TokenData
  ): Promise<UpdateUserStudentOutputDto> {
    return await this._updateUserStudent.execute(input, token);
  }
  async checkUserStudentFromToken(token: TokenData): Promise<boolean> {
    const userStudent = await this._findUserStudentByBaseUser.execute(token);
    return !!userStudent;
  }
}
