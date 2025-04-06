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

type WorkerFacadeProps = {
  createUserWorker: CreateUserWorker;
  deleteUserWorker: DeleteUserWorker;
  findAllUserWorker: FindAllUserWorker;
  findUserWorker: FindUserWorker;
  updateUserWorker: UpdateUserWorker;
};
export default class WorkerFacade implements WorkerFacadeInterface {
  private _createUserWorker: CreateUserWorker;
  private _deleteUserWorker: DeleteUserWorker;
  private _findAllUserWorker: FindAllUserWorker;
  private _findUserWorker: FindUserWorker;
  private _updateUserWorker: UpdateUserWorker;

  constructor(input: WorkerFacadeProps) {
    this._createUserWorker = input.createUserWorker;
    this._deleteUserWorker = input.deleteUserWorker;
    this._findAllUserWorker = input.findAllUserWorker;
    this._findUserWorker = input.findUserWorker;
    this._updateUserWorker = input.updateUserWorker;
  }

  async create(
    input: CreateUserWorkerInputDto
  ): Promise<CreateUserWorkerOutputDto> {
    return await this._createUserWorker.execute(input);
  }
  async find(
    input: FindUserWorkerInputDto
  ): Promise<FindUserWorkerOutputDto | undefined> {
    return await this._findUserWorker.execute(input);
  }
  async findAll(
    input: FindAllUserWorkerInputDto
  ): Promise<FindAllUserWorkerOutputDto> {
    return await this._findAllUserWorker.execute(input);
  }
  async delete(
    input: DeleteUserWorkerInputDto
  ): Promise<DeleteUserWorkerOutputDto> {
    return await this._deleteUserWorker.execute(input);
  }
  async update(
    input: UpdateUserWorkerInputDto
  ): Promise<UpdateUserWorkerOutputDto> {
    return await this._updateUserWorker.execute(input);
  }
}
