import UserWorker from '../domain/entity/user-worker.entity';

export default interface UserWorkerGateway {
  find(id: string): Promise<Omit<UserWorker, 'id'> | undefined>;
  findAll(
    quantity?: number,
    offSet?: number
  ): Promise<Omit<UserWorker, 'id'>[]>;
  create(userWorker: UserWorker): Promise<string>;
  update(userWorker: UserWorker): Promise<Omit<UserWorker, 'id'>>;
  delete(id: string): Promise<string>;
}
