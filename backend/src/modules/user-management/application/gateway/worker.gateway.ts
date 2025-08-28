import UserWorker from '@/modules/user-management/domain/entity/worker.entity';

export default interface UserWorkerGateway {
  find(masterId: string, id: string): Promise<UserWorker | null>;
  findByBaseUserId(masterId: string, userId: string): Promise<UserWorker | null>;
  findAll(masterId: string, quantity?: number, offSet?: number): Promise<UserWorker[]>;
  create(masterId: string, userWorker: UserWorker): Promise<string>;
  update(masterId: string, userWorker: UserWorker): Promise<UserWorker>;
  delete(masterId: string, userWorker: UserWorker): Promise<string>;
}
