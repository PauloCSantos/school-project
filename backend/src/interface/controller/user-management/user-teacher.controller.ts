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
} from '@/application/dto/user-management/teacher-usecase.dto';
import CreateUserTeacher from '@/application/usecases/user-management/teacher/createUserTeacher.usecase';
import DeleteUserTeacher from '@/application/usecases/user-management/teacher/deleteUserTeacher.usecase';
import FindAllUserTeacher from '@/application/usecases/user-management/teacher/findAllUserTeacher.usecase';
import FindUserTeacher from '@/application/usecases/user-management/teacher/findUserTeacher.usecase';
import UpdateUserTeacher from '@/application/usecases/user-management/teacher/updateUserTeacher.usecase';

export class UserTeacherController {
  constructor(
    private readonly createUserTeacher: CreateUserTeacher,
    private readonly findUserTeacher: FindUserTeacher,
    private readonly findAllUserTeacher: FindAllUserTeacher,
    private readonly updateUserTeacher: UpdateUserTeacher,
    private readonly deleteUserTeacher: DeleteUserTeacher
  ) {}

  async create(
    input: CreateUserTeacherInputDto
  ): Promise<CreateUserTeacherOutputDto> {
    const response = await this.createUserTeacher.execute(input);
    return response;
  }
  async find(
    input: FindUserTeacherInputDto
  ): Promise<FindUserTeacherOutputDto | undefined> {
    const response = await this.findUserTeacher.execute(input);
    return response;
  }
  async findAll(
    input: FindAllUserTeacherInputDto
  ): Promise<FindAllUserTeacherOutputDto> {
    const response = await this.findAllUserTeacher.execute(input);
    return response;
  }
  async delete(
    input: DeleteUserTeacherInputDto
  ): Promise<DeleteUserTeacherOutputDto> {
    const response = await this.deleteUserTeacher.execute(input);
    return response;
  }
  async update(
    input: UpdateUserTeacherInputDto
  ): Promise<UpdateUserTeacherOutputDto> {
    const response = await this.updateUserTeacher.execute(input);
    return response;
  }
}
