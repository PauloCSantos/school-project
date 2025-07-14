import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
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
import { TokenData } from '@/modules/@shared/type/sharedTypes';

export class UserWorkerController {
  constructor(
    private readonly createUserWorker: CreateUserWorker,
    private readonly findUserWorker: FindUserWorker,
    private readonly findAllUserWorker: FindAllUserWorker,
    private readonly updateUserWorker: UpdateUserWorker,
    private readonly deleteUserWorker: DeleteUserWorker,
    private readonly policiesService: PoliciesServiceInterface
  ) {}

  async create(
    input: CreateUserWorkerInputDto,
    token: TokenData
  ): Promise<CreateUserWorkerOutputDto> {
    const response = await this.createUserWorker.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async find(
    input: FindUserWorkerInputDto,
    token: TokenData
  ): Promise<FindUserWorkerOutputDto | null> {
    const response = await this.findUserWorker.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async findAll(
    input: FindAllUserWorkerInputDto,
    token: TokenData
  ): Promise<FindAllUserWorkerOutputDto> {
    const response = await this.findAllUserWorker.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async delete(
    input: DeleteUserWorkerInputDto,
    token: TokenData
  ): Promise<DeleteUserWorkerOutputDto> {
    const response = await this.deleteUserWorker.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
  async update(
    input: UpdateUserWorkerInputDto,
    token: TokenData
  ): Promise<UpdateUserWorkerOutputDto> {
    const response = await this.updateUserWorker.execute(
      input,
      this.policiesService,
      token
    );
    return response;
  }
}
