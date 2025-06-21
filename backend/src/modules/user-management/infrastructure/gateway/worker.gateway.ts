import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

export default interface UserWorkerGateway {
  find(id: string): Promise<UserWorker | null>;
  findAll(quantity?: number, offSet?: number): Promise<UserWorker[]>;
  create(userWorker: UserWorker): Promise<string>;
  update(userWorker: UserWorker): Promise<UserWorker>;
  delete(id: string): Promise<string>;
}
