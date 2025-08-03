import CreateUserWorker from '../../usecases/worker/createUserWorker.usecase';
import DeleteUserWorker from '../../usecases/worker/deleteUserWorker.usecase';
import FindAllUserWorker from '../../usecases/worker/findAllUserWorker.usecase';
import FindUserWorker from '../../usecases/worker/findUserWorker.usecase';
import UpdateUserWorker from '../../usecases/worker/updateUserWorker.usecase';
import WorkerFacadeInterface from '../interface/worker-facade.interface';
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
import { TokenData } from '@/modules/@shared/type/sharedTypes';

type WorkerFacadeProps = {
  readonly createUserWorker: CreateUserWorker;
  readonly deleteUserWorker: DeleteUserWorker;
  readonly findAllUserWorker: FindAllUserWorker;
  readonly findUserWorker: FindUserWorker;
  readonly updateUserWorker: UpdateUserWorker;
};
export default class WorkerFacade implements WorkerFacadeInterface {
  private readonly _createUserWorker: CreateUserWorker;
  private readonly _deleteUserWorker: DeleteUserWorker;
  private readonly _findAllUserWorker: FindAllUserWorker;
  private readonly _findUserWorker: FindUserWorker;
  private readonly _updateUserWorker: UpdateUserWorker;

  constructor(input: WorkerFacadeProps) {
    this._createUserWorker = input.createUserWorker;
    this._deleteUserWorker = input.deleteUserWorker;
    this._findAllUserWorker = input.findAllUserWorker;
    this._findUserWorker = input.findUserWorker;
    this._updateUserWorker = input.updateUserWorker;
  }

  async create(
    input: CreateUserWorkerInputDto,
    token: TokenData
  ): Promise<CreateUserWorkerOutputDto> {
    return await this._createUserWorker.execute(input, token);
  }
  async find(
    input: FindUserWorkerInputDto,
    token: TokenData
  ): Promise<FindUserWorkerOutputDto | null> {
    return await this._findUserWorker.execute(input, token);
  }
  async findAll(
    input: FindAllUserWorkerInputDto,
    token: TokenData
  ): Promise<FindAllUserWorkerOutputDto> {
    return await this._findAllUserWorker.execute(input, token);
  }
  async delete(
    input: DeleteUserWorkerInputDto,
    token: TokenData
  ): Promise<DeleteUserWorkerOutputDto> {
    return await this._deleteUserWorker.execute(input, token);
  }
  async update(
    input: UpdateUserWorkerInputDto,
    token: TokenData
  ): Promise<UpdateUserWorkerOutputDto> {
    return await this._updateUserWorker.execute(input, token);
  }
}
