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
} from '../../dto/student-facade.dto';

export default interface StudentFacadeInterface {
  create(input: CreateUserStudentInputDto): Promise<CreateUserStudentOutputDto>;
  find(
    input: FindUserStudentInputDto
  ): Promise<FindUserStudentOutputDto | null>;
  findAll(
    input: FindAllUserStudentInputDto
  ): Promise<FindAllUserStudentOutputDto>;
  delete(input: DeleteUserStudentInputDto): Promise<DeleteUserStudentOutputDto>;
  update(input: UpdateUserStudentInputDto): Promise<UpdateUserStudentOutputDto>;
}
