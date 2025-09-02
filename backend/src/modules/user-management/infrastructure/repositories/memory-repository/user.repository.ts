import UserGateway from '@/modules/user-management/application/gateway/user.gateway';
import { UserBase } from '@/modules/user-management/domain/entity/user.entity';
import { UserMapper, UserMapperProps } from '../../mapper/user.mapper';
import { UserNotFoundError } from '@/modules/user-management/application/errors/user-not-found.error';

/**
 * In-memory implementation of UserGateway.
 * Stores and manipulates user records in memory.
 */
export default class MemoryUserRepository implements UserGateway {
  private _users: Map<string, UserMapperProps> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param userRecords - Optional initial array of user records
   */
  constructor(records?: UserBase[]) {
    if (!records?.length) return;

    for (const user of records) {
      this._users.set(user.id.value, UserMapper.toObj(user));
    }
  }

  /**
   * Finds an user record by its unique identifier.
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found user or null if not found
   */
  async find(id: string): Promise<UserBase | null> {
    const obj = this._users.get(id);
    return obj ? UserMapper.toInstance(obj) : null;
  }

  /**
   * Finds an user record by email.
   * @param email - The email to search for
   * @returns Promise resolving to the found user or null if not found
   */
  async findByEmail(email: string): Promise<UserBase | null> {
    for (const user of this._users.values()) {
      if (user.email === email) return UserMapper.toInstance(user);
    }
    return null;
  }

  /**
   * Finds an user record by ids from the array.
   * @param ids - The ids array
   * @returns Promise resolving to the found user of array
   */
  async findManyByIds(ids: readonly string[]): Promise<UserBase[]> {
    if (!ids?.length) return [];

    const result: UserBase[] = [];

    for (const id of ids) {
      const obj = this._users.get(id);
      if (obj) {
        result.push(UserMapper.toInstance(obj));
      }
    }

    return result;
  }

  /**
   * Creates a new user record in memory.
   * @param user - The user entity to be created
   * @returns Promise resolving to the unique identifier of the created user record
   */
  async create(user: UserBase): Promise<string> {
    this._users.set(user.id.value, UserMapper.toObj(user));
    return user.id.value;
  }

  /**
   * Updates an existing user record identified by its ID.
   * @param user - The user entity with updated information
   * @returns Promise resolving to the updated User entity
   * @throws Error if the user record is not found
   */
  async update(user: UserBase): Promise<UserBase> {
    const users = this._users.get(user.id.value);
    if (!users) {
      throw new UserNotFoundError('base', user.id.value);
    }
    this._users.set(user.id.value, UserMapper.toObj(user));
    return user;
  }

  /**
   * Deletes an user record by its unique identifier.
   * @param id - The unique identifier of the user record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the user record is not found
   */
  async delete(id: string): Promise<string> {
    const users = this._users.get(id);
    if (!users) {
      throw new UserNotFoundError('base', id);
    }
    this._users.delete(id);
    return 'Operação concluída com sucesso';
  }
}
