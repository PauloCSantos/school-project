import UserAdministratorGateway from '../../../application/gateway/administrator.gateway';
import UserAdministrator from '@/modules/user-management/domain/entity/administrator.entity';
import {
  AdministratorMapper,
  AdministratorMapperProps,
} from '../../mapper/administrator.mapper';

/**
 * In-memory implementation of AdministratorGateway.
 * Stores and manipulates administrator records in memory.
 */
export default class MemoryUserAdministratorRepository
  implements UserAdministratorGateway
{
  private _administratorUsers: Map<
    string,
    Map<string, AdministratorMapperProps>
  > = new Map();

  /**
   * Creates a new in-memory repository.
   * @param administratorRecords - Optional initial array of administrator records
    Ex.: new MemoryAdministratorRepository([{ masterId, records: [a1, a2] }])
   */
  constructor(
    administratorRecords?: Array<{
      masterId: string;
      records: UserAdministrator[];
    }>
  ) {
    if (administratorRecords) {
      for (const { masterId, records } of administratorRecords) {
        let usersAdministrator = this._administratorUsers.get(masterId);
        if (!usersAdministrator) {
          usersAdministrator = new Map<string, AdministratorMapperProps>();
          this._administratorUsers.set(masterId, usersAdministrator);
        }
        for (const userAdministrator of records) {
          usersAdministrator.set(
            userAdministrator.id.value,
            AdministratorMapper.toObj(userAdministrator)
          );
        }
      }
    }
  }

  /**
   * Finds an administrator record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found administrator or null if not found
   */
  async find(masterId: string, id: string): Promise<UserAdministrator | null> {
    const obj = this._administratorUsers.get(masterId)?.get(id);
    return obj ? AdministratorMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of administrator records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of UserAdministrator entities
   */
  async findAll(
    masterId: string,
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<UserAdministrator[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const administratorUsers = this._administratorUsers.get(masterId);
    if (!administratorUsers) return [];
    const page = Array.from(administratorUsers.values()).slice(
      offS,
      offS + qtd
    );
    return AdministratorMapper.toInstanceList(page);
  }

  /**
   * Finds an administrator record by email.
   * @param masterId - The tenant unique identifier
   * @param email - The email to search for
   * @returns Promise resolving to the found administrator or null if not found
   */
  async findByEmail(
    masterId: string,
    email: string
  ): Promise<UserAdministrator | null> {
    const administratorUsers = this._administratorUsers.get(masterId);
    if (!administratorUsers) return null;
    for (const userAdministrator of administratorUsers.values()) {
      if (userAdministrator.email === email)
        return AdministratorMapper.toInstance(userAdministrator);
    }
    return null;
  }

  /**
   * Creates a new administrator record in memory.
   * @param masterId - The tenant unique identifier
   * @param userAdministrator - The administrator entity to be created
   * @returns Promise resolving to the unique identifier of the created administrator record
   */
  async create(
    masterId: string,
    userAdministrator: UserAdministrator
  ): Promise<string> {
    const administratorUsers = this.getOrCreateBucket(masterId);
    administratorUsers.set(
      userAdministrator.id.value,
      AdministratorMapper.toObj(userAdministrator)
    );
    return userAdministrator.id.value;
  }

  /**
   * Updates an existing administrator record identified by its ID.
   * @param masterId - The tenant unique identifier
   * @param userAdministrator - The administrator entity with updated information
   * @returns Promise resolving to the updated UserAdministrator entity
   * @throws Error if the administrator record is not found
   */
  async update(
    masterId: string,
    userAdministrator: UserAdministrator
  ): Promise<UserAdministrator> {
    const administratorUsers = this._administratorUsers.get(masterId);
    if (
      !administratorUsers ||
      !administratorUsers.has(userAdministrator.id.value)
    ) {
      throw new Error('User not found');
    }
    administratorUsers.set(
      userAdministrator.id.value,
      AdministratorMapper.toObj(userAdministrator)
    );
    return userAdministrator;
  }

  /**
   * Deletes an administrator record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the administrator record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the administrator record is not found
   */
  async delete(masterId: string, id: string): Promise<string> {
    const administratorUsers = this._administratorUsers.get(masterId);
    if (!administratorUsers || !administratorUsers.has(id)) {
      throw new Error('User not found');
    }
    administratorUsers.delete(id);
    return 'Operação concluída com sucesso';
  }

  private getOrCreateBucket(
    masterId: string
  ): Map<string, AdministratorMapperProps> {
    let administratorUsers = this._administratorUsers.get(masterId);
    if (!administratorUsers) {
      administratorUsers = new Map<string, AdministratorMapperProps>();
      this._administratorUsers.set(masterId, administratorUsers);
    }
    return administratorUsers;
  }
}
