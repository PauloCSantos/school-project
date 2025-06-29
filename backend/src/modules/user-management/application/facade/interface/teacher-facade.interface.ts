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

export default interface TeacherFacadeInterface {
  create(input: CreateUserTeacherInputDto): Promise<CreateUserTeacherOutputDto>;
  find(
    input: FindUserTeacherInputDto
  ): Promise<FindUserTeacherOutputDto | null>;
  findAll(
    input: FindAllUserTeacherInputDto
  ): Promise<FindAllUserTeacherOutputDto>;
  delete(input: DeleteUserTeacherInputDto): Promise<DeleteUserTeacherOutputDto>;
  update(input: UpdateUserTeacherInputDto): Promise<UpdateUserTeacherOutputDto>;
}
