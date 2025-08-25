import { TokenData } from '@/modules/@shared/type/sharedTypes';
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
} from '../../../application/dto/teacher-facade.dto';

export default interface TeacherFacadeInterface {
  create(
    input: CreateUserTeacherInputDto,
    token: TokenData
  ): Promise<CreateUserTeacherOutputDto>;
  find(
    input: FindUserTeacherInputDto,
    token: TokenData
  ): Promise<FindUserTeacherOutputDto | null>;
  findAll(
    input: FindAllUserTeacherInputDto,
    token: TokenData
  ): Promise<FindAllUserTeacherOutputDto>;
  delete(
    input: DeleteUserTeacherInputDto,
    token: TokenData
  ): Promise<DeleteUserTeacherOutputDto>;
  update(
    input: UpdateUserTeacherInputDto,
    token: TokenData
  ): Promise<UpdateUserTeacherOutputDto>;
}
