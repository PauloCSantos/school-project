import UserMasterGateway from '../../../application/gateway/master.gateway';
import UserMaster from '@/modules/user-management/domain/entity/master.entity';
import { MasterMapper, MasterMapperProps } from '../../mapper/master.mapper';
import { UserNotFoundError } from '@/modules/user-management/application/errors/user-not-found.error';
import { RoleUsersEnum } from '@/modules/@shared/enums/enums';

/**
 * In-memory implementation of MasterGateway.
 * Stores and manipulates master records in memory.
 */
export default class MemoryUserMasterRepository implements UserMasterGateway {
  private _masterUsers: Map<string, Map<string, MasterMapperProps>> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param masterRecords - Optional initial array of master records
    Ex.: new MemoryUserMasterRepository([{ masterId, records: [m1, m2] }])
   */
  constructor(
    masterRecords?: Array<{
      masterId: string;
      records: UserMaster[];
    }>
  ) {
    if (masterRecords) {
      for (const { masterId, records } of masterRecords) {
        let masterUsers = this._masterUsers.get(masterId);
        if (!masterUsers) {
          masterUsers = new Map<string, MasterMapperProps>();
          this._masterUsers.set(masterId, masterUsers);
        }
        for (const userMaster of records) {
          masterUsers.set(userMaster.id.value, MasterMapper.toObj(userMaster));
        }
      }
    }
  }

  /**
   * Finds a master record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found master or null if not found
   */
  async find(masterId: string, id: string): Promise<UserMaster | null> {
    const obj = this._masterUsers.get(masterId)?.get(id);
    return obj ? MasterMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of master records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of UserMaster entities
   */
  async findAll(
    masterId: string,
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<UserMaster[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const masterUsers = this._masterUsers.get(masterId);
    if (!masterUsers) return [];
    const page = Array.from(masterUsers.values()).slice(offS, offS + qtd);
    return MasterMapper.toInstanceList(page);
  }

  /**
   * Finds a master record by email.
   * @param masterId - The tenant unique identifier
   * @param userId - The user id to search for
   * @returns Promise resolving to the found master or null if not found
   */
  async findByBaseUserId(masterId: string, userId: string): Promise<UserMaster | null> {
    const masterUsers = this._masterUsers.get(masterId);
    if (!masterUsers) return null;
    for (const userMaster of masterUsers.values()) {
      if (userMaster.userId === userId) return MasterMapper.toInstance(userMaster);
    }
    return null;
  }

  /**
   * Creates a new master record in memory.
   * @param masterId - The tenant unique identifier
   * @param userMaster - The master entity to be created
   * @returns Promise resolving to the unique identifier of the created master record
   */
  async create(masterId: string, userMaster: UserMaster): Promise<string> {
    const masterUsers = this.getOrCreateBucket(masterId);
    masterUsers.set(userMaster.id.value, MasterMapper.toObj(userMaster));
    return userMaster.id.value;
  }

  /**
   * Updates an existing master record identified by its ID.
   * @param masterId - The tenant unique identifier
   * @param userMaster - The master entity with updated information
   * @returns Promise resolving to the updated UserMaster entity
   * @throws Error if the master record is not found
   */
  async update(masterId: string, userMaster: UserMaster): Promise<UserMaster> {
    const masterUsers = this._masterUsers.get(masterId);
    if (!masterUsers || !masterUsers.has(userMaster.id.value)) {
      throw new UserNotFoundError(RoleUsersEnum.MASTER, userMaster.id.value);
    }
    masterUsers.set(userMaster.id.value, MasterMapper.toObj(userMaster));
    return userMaster;
  }

  /**
   * Deletes a master record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the master record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the master record is not found
   */
  async delete(masterId: string, id: string): Promise<string> {
    const masterUsers = this._masterUsers.get(masterId);
    if (!masterUsers || !masterUsers.has(id)) {
      throw new UserNotFoundError(RoleUsersEnum.MASTER, id);
    }
    masterUsers.delete(id);
    return 'Operation completed successfully';
  }

  private getOrCreateBucket(masterId: string): Map<string, MasterMapperProps> {
    let masterUsers = this._masterUsers.get(masterId);
    if (!masterUsers) {
      masterUsers = new Map<string, MasterMapperProps>();
      this._masterUsers.set(masterId, masterUsers);
    }
    return masterUsers;
  }
}
