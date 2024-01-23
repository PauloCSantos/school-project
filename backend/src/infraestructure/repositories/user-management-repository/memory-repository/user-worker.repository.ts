import UserWorker from '@/modules/user-management/worker/domain/entity/user-worker.entity';
import UserWorkerGateway from '@/modules/user-management/worker/gateway/user-worker.gateway';

export default class MemoryUserWorkerRepository implements UserWorkerGateway {
  private _workerUsers: UserWorker[];

  constructor(workerUsers?: UserWorker[]) {
    workerUsers ? (this._workerUsers = workerUsers) : (this._workerUsers = []);
  }

  async find(id: string): Promise<UserWorker | undefined> {
    const user = this._workerUsers.find(user => user.id.id === id);
    if (user) {
      return user;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<UserWorker[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const users = this._workerUsers.slice(offS, qtd);

    return users;
  }
  async create(UserWorker: UserWorker): Promise<string> {
    this._workerUsers.push(UserWorker);
    return UserWorker.id.id;
  }
  async update(UserWorker: UserWorker): Promise<UserWorker> {
    const workerUserIndex = this._workerUsers.findIndex(
      user => user.id.id === UserWorker.id?.id
    );
    if (workerUserIndex !== -1) {
      return (this._workerUsers[workerUserIndex] = UserWorker);
    } else {
      throw new Error('User not found');
    }
  }
  async delete(id: string): Promise<string> {
    const workerUserIndex = this._workerUsers.findIndex(
      user => user.id.id === id
    );
    if (workerUserIndex !== -1) {
      this._workerUsers.splice(workerUserIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('User not found');
    }
  }
}
