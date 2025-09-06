import { TokenData } from '@/modules/@shared/type/sharedTypes';
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

export default interface StudentFacadeInterface {
  create(
    input: CreateUserStudentInputDto,
    token: TokenData
  ): Promise<CreateUserStudentOutputDto>;
  find(
    input: FindUserStudentInputDto,
    token: TokenData
  ): Promise<FindUserStudentOutputDto | null>;
  findAll(
    input: FindAllUserStudentInputDto,
    token: TokenData
  ): Promise<FindAllUserStudentOutputDto>;
  delete(
    input: DeleteUserStudentInputDto,
    token: TokenData
  ): Promise<DeleteUserStudentOutputDto>;
  update(
    input: UpdateUserStudentInputDto,
    token: TokenData
  ): Promise<UpdateUserStudentOutputDto>;
  checkUserStudentFromToken(token: TokenData): Promise<boolean>;
}
