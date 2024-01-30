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
} from '@/application/dto/user-management/worker-facade.dto';

export default interface WorkerFacadeInterface {
  create(input: CreateUserWorkerInputDto): Promise<CreateUserWorkerOutputDto>;
  find(
    input: FindUserWorkerInputDto
  ): Promise<FindUserWorkerOutputDto | undefined>;
  findAll(
    input: FindAllUserWorkerInputDto
  ): Promise<FindAllUserWorkerOutputDto>;
  delete(input: DeleteUserWorkerInputDto): Promise<DeleteUserWorkerOutputDto>;
  update(input: UpdateUserWorkerInputDto): Promise<UpdateUserWorkerOutputDto>;
}
