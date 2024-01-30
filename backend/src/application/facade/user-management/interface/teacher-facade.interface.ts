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
} from '@/application/dto/user-management/teacher-facade.dto';

export default interface TeacherFacadeInterface {
  create(input: CreateUserTeacherInputDto): Promise<CreateUserTeacherOutputDto>;
  find(
    input: FindUserTeacherInputDto
  ): Promise<FindUserTeacherOutputDto | undefined>;
  findAll(
    input: FindAllUserTeacherInputDto
  ): Promise<FindAllUserTeacherOutputDto>;
  delete(input: DeleteUserTeacherInputDto): Promise<DeleteUserTeacherOutputDto>;
  update(input: UpdateUserTeacherInputDto): Promise<UpdateUserTeacherOutputDto>;
}
