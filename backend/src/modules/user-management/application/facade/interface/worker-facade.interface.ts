import { TokenData } from '@/modules/@shared/type/sharedTypes';
import {
  CreateUserWorkerInputDto,
  CreateUserWorkerOutputDto,
  DeleteUserWorkerInputDto,
  DeleteUserWorkerOutputDto,
  FindAllUserWorkerInputDto,
  FindAllUserWorkerOutputDto,
  FindUserWorkerInputDto,
  FindUserWorkerOutputDto,
  UpdateUserWorkerInputDto,
  UpdateUserWorkerOutputDto,
} from '../../dto/worker-facade.dto';

export default interface WorkerFacadeInterface {
  create(
    input: CreateUserWorkerInputDto,
    token: TokenData
  ): Promise<CreateUserWorkerOutputDto>;
  find(
    input: FindUserWorkerInputDto,
    token: TokenData
  ): Promise<FindUserWorkerOutputDto | null>;
  findAll(
    input: FindAllUserWorkerInputDto,
    token: TokenData
  ): Promise<FindAllUserWorkerOutputDto>;
  delete(
    input: DeleteUserWorkerInputDto,
    token: TokenData
  ): Promise<DeleteUserWorkerOutputDto>;
  update(
    input: UpdateUserWorkerInputDto,
    token: TokenData
  ): Promise<UpdateUserWorkerOutputDto>;
}
