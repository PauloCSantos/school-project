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
} from '../../application/dto/student-usecase.dto';
import CreateUserStudent from '../../application/usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '../../application/usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '../../application/usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '../../application/usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '../../application/usecases/student/updateUserStudent.usecase';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

export class UserStudentController {
  constructor(
    private readonly createUserStudent: CreateUserStudent,
    private readonly findUserStudent: FindUserStudent,
    private readonly findAllUserStudent: FindAllUserStudent,
    private readonly updateUserStudent: UpdateUserStudent,
    private readonly deleteUserStudent: DeleteUserStudent
  ) {}

  async create(
    input: CreateUserStudentInputDto,
    token: TokenData
  ): Promise<CreateUserStudentOutputDto> {
    const response = await this.createUserStudent.execute(input, token);
    return response;
  }
  async find(
    input: FindUserStudentInputDto,
    token: TokenData
  ): Promise<FindUserStudentOutputDto | null> {
    const response = await this.findUserStudent.execute(input, token);
    return response;
  }
  async findAll(
    input: FindAllUserStudentInputDto,
    token: TokenData
  ): Promise<FindAllUserStudentOutputDto> {
    const response = await this.findAllUserStudent.execute(input, token);
    return response;
  }
  async delete(
    input: DeleteUserStudentInputDto,
    token: TokenData
  ): Promise<DeleteUserStudentOutputDto> {
    const response = await this.deleteUserStudent.execute(input, token);
    return response;
  }
  async update(
    input: UpdateUserStudentInputDto,
    token: TokenData
  ): Promise<UpdateUserStudentOutputDto> {
    const response = await this.updateUserStudent.execute(input, token);
    return response;
  }
}
