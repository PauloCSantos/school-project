import UserWorkerGateway from '../../../application/gateway/worker.gateway';
import UserWorker from '@/modules/user-management/domain/entity/worker.entity';
import { WorkerMapper, WorkerMapperProps } from '../../mapper/worker.mapper';
import { UserNotFoundError } from '@/modules/user-management/application/errors/user-not-found.error';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

/**
 * In-memory implementation of WorkerGateway.
 * Stores and manipulates worker records in memory.
 */
export default class MemoryUserWorkerRepository implements UserWorkerGateway {
  private _workerUsers: Map<string, Map<string, WorkerMapperProps>> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param workerRecords - Optional initial array of worker records
   * Ex.: new MemoryUserWorkerRepository([{ masterId, records: [w1, w2] }])
   */
  constructor(
    workerRecords?: Array<{
      masterId: string;
      records: UserWorker[];
    }>
  ) {
    if (workerRecords) {
      for (const { masterId, records } of workerRecords) {
        let workerUsers = this._workerUsers.get(masterId);
        if (!workerUsers) {
          workerUsers = new Map<string, WorkerMapperProps>();
          this._workerUsers.set(masterId, workerUsers);
        }
        for (const userWorker of records) {
          workerUsers.set(userWorker.id.value, WorkerMapper.toObj(userWorker));
        }
      }
    }
  }

  /**
   * Finds a worker record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found worker or null if not found
   */
  async find(masterId: string, id: string): Promise<UserWorker | null> {
    const obj = this._workerUsers.get(masterId)?.get(id);
    return obj ? WorkerMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of worker records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of UserWorker entities
   */
  async findAll(
    masterId: string,
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<UserWorker[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const workerUsers = this._workerUsers.get(masterId);
    if (!workerUsers) return [];
    const page = Array.from(workerUsers.values()).slice(offS, offS + qtd);
    return WorkerMapper.toInstanceList(page);
  }

  /**
   * Finds a worker record by email.
   * @param masterId - The tenant unique identifier
   * @param userId - The user id to search for
   * @returns Promise resolving to the found worker or null if not found
   */
  async findByBaseUserId(masterId: string, userId: string): Promise<UserWorker | null> {
    const workerUsers = this._workerUsers.get(masterId);
    if (!workerUsers) return null;
    for (const userWorker of workerUsers.values()) {
      if (userWorker.userId === userId) return WorkerMapper.toInstance(userWorker);
    }
    return null;
  }

  /**
   * Creates a new worker record in memory.
   * @param masterId - The tenant unique identifier
   * @param userWorker - The worker entity to be created
   * @returns Promise resolving to the unique identifier of the created worker record
   */
  async create(masterId: string, userWorker: UserWorker): Promise<string> {
    const workerUsers = this.getOrCreateBucket(masterId);
    workerUsers.set(userWorker.id.value, WorkerMapper.toObj(userWorker));
    return userWorker.id.value;
  }

  /**
   * Updates an existing worker record identified by its ID.
   * @param masterId - The tenant unique identifier
   * @param userWorker - The worker entity with updated information
   * @returns Promise resolving to the updated UserWorker entity
   * @throws Error if the worker record is not found
   */
  async update(masterId: string, userWorker: UserWorker): Promise<UserWorker> {
    const workerUsers = this._workerUsers.get(masterId);
    if (!workerUsers || !workerUsers.has(userWorker.id.value)) {
      throw new UserNotFoundError(RoleUsersEnum.WORKER, userWorker.id.value);
    }
    workerUsers.set(userWorker.id.value, WorkerMapper.toObj(userWorker));
    return userWorker;
  }

  /**
   * Deletes a worker record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the worker record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the worker record is not found
   */
  async delete(masterId: string, userWorker: UserWorker): Promise<string> {
    const workerUsers = this._workerUsers.get(masterId);
    if (!workerUsers || !workerUsers.has(userWorker.id.value)) {
      throw new UserNotFoundError(RoleUsersEnum.WORKER, userWorker.id.value);
    }
    workerUsers.set(userWorker.id.value, WorkerMapper.toObj(userWorker));
    return 'Operation completed successfully';
  }

  private getOrCreateBucket(masterId: string): Map<string, WorkerMapperProps> {
    let workerUsers = this._workerUsers.get(masterId);
    if (!workerUsers) {
      workerUsers = new Map<string, WorkerMapperProps>();
      this._workerUsers.set(masterId, workerUsers);
    }
    return workerUsers;
  }
}
