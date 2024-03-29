import UserWorker from '@/modules/user-management/domain/entity/user-worker.entity';

export default interface UserWorkerGateway {
  find(id: string): Promise<UserWorker | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<UserWorker[]>;
  create(userWorker: UserWorker): Promise<string>;
  update(userWorker: UserWorker): Promise<UserWorker>;
  delete(id: string): Promise<string>;
}
