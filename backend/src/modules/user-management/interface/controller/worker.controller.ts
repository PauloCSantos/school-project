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
} from '../../application/dto/worker-usecase.dto';
import CreateUserWorker from '../../application/usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '../../application/usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '../../application/usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '../../application/usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '../../application/usecases/worker/updateUserWorker.usecase';

export class UserWorkerController {
  constructor(
    private readonly createUserWorker: CreateUserWorker,
    private readonly findUserWorker: FindUserWorker,
    private readonly findAllUserWorker: FindAllUserWorker,
    private readonly updateUserWorker: UpdateUserWorker,
    private readonly deleteUserWorker: DeleteUserWorker
  ) {}

  async create(
    input: CreateUserWorkerInputDto
  ): Promise<CreateUserWorkerOutputDto> {
    const response = await this.createUserWorker.execute(input);
    return response;
  }
  async find(
    input: FindUserWorkerInputDto
  ): Promise<FindUserWorkerOutputDto | null> {
    const response = await this.findUserWorker.execute(input);
    return response;
  }
  async findAll(
    input: FindAllUserWorkerInputDto
  ): Promise<FindAllUserWorkerOutputDto> {
    const response = await this.findAllUserWorker.execute(input);
    return response;
  }
  async delete(
    input: DeleteUserWorkerInputDto
  ): Promise<DeleteUserWorkerOutputDto> {
    const response = await this.deleteUserWorker.execute(input);
    return response;
  }
  async update(
    input: UpdateUserWorkerInputDto
  ): Promise<UpdateUserWorkerOutputDto> {
    const response = await this.updateUserWorker.execute(input);
    return response;
  }
}
