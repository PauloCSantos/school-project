import UserTeacherGateway from '../../../application/gateway/teacher.gateway';
import UserTeacher from '@/modules/user-management/domain/entity/teacher.entity';
import { TeacherMapper, TeacherMapperProps } from '../../mapper/teacher.mapper';

/**
 * In-memory implementation of TeacherGateway.
 * Stores and manipulates teacher records in memory.
 */
export default class MemoryUserTeacherRepository implements UserTeacherGateway {
  private _teacherUsers: Map<string, Map<string, TeacherMapperProps>> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param teacherRecords - Optional initial array of teacher records
   * Ex.: new MemoryUserTeacherRepository([{ masterId, records: [t1, t2] }])
   */
  constructor(
    teacherRecords?: Array<{
      masterId: string;
      records: UserTeacher[];
    }>
  ) {
    if (teacherRecords) {
      for (const { masterId, records } of teacherRecords) {
        let teacherUsers = this._teacherUsers.get(masterId);
        if (!teacherUsers) {
          teacherUsers = new Map<string, TeacherMapperProps>();
          this._teacherUsers.set(masterId, teacherUsers);
        }
        for (const userTeacher of records) {
          teacherUsers.set(userTeacher.id.value, TeacherMapper.toObj(userTeacher));
        }
      }
    }
  }

  /**
   * Finds a teacher record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found teacher or null if not found
   */
  async find(masterId: string, id: string): Promise<UserTeacher | null> {
    const obj = this._teacherUsers.get(masterId)?.get(id);
    return obj ? TeacherMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of teacher records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of UserTeacher entities
   */
  async findAll(
    masterId: string,
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<UserTeacher[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const teacherUsers = this._teacherUsers.get(masterId);
    if (!teacherUsers) return [];
    const page = Array.from(teacherUsers.values()).slice(offS, offS + qtd);
    return TeacherMapper.toInstanceList(page);
  }

  /**
   * Finds a teacher record by email.
   * @param masterId - The tenant unique identifier
   * @param userId - The user id to search for
   * @returns Promise resolving to the found teacher or null if not found
   */
  async findByBaseUserId(masterId: string, userId: string): Promise<UserTeacher | null> {
    const teacherUsers = this._teacherUsers.get(masterId);
    if (!teacherUsers) return null;
    for (const userTeacher of teacherUsers.values()) {
      if (userTeacher.userId === userId) return TeacherMapper.toInstance(userTeacher);
    }
    return null;
  }

  /**
   * Creates a new teacher record in memory.
   * @param masterId - The tenant unique identifier
   * @param userTeacher - The teacher entity to be created
   * @returns Promise resolving to the unique identifier of the created teacher record
   */
  async create(masterId: string, userTeacher: UserTeacher): Promise<string> {
    const teacherUsers = this.getOrCreateBucket(masterId);
    teacherUsers.set(userTeacher.id.value, TeacherMapper.toObj(userTeacher));
    return userTeacher.id.value;
  }

  /**
   * Updates an existing teacher record identified by its ID.
   * @param masterId - The tenant unique identifier
   * @param userTeacher - The teacher entity with updated information
   * @returns Promise resolving to the updated UserTeacher entity
   * @throws Error if the teacher record is not found
   */
  async update(masterId: string, userTeacher: UserTeacher): Promise<UserTeacher> {
    const teacherUsers = this._teacherUsers.get(masterId);
    if (!teacherUsers || !teacherUsers.has(userTeacher.id.value)) {
      throw new Error('User not found');
    }
    teacherUsers.set(userTeacher.id.value, TeacherMapper.toObj(userTeacher));
    return userTeacher;
  }

  /**
   * Deletes a teacher record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the teacher record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the teacher record is not found
   */
  async delete(masterId: string, userTeacher: UserTeacher): Promise<string> {
    const teacherUsers = this._teacherUsers.get(masterId);
    if (!teacherUsers || !teacherUsers.has(userTeacher.id.value)) {
      throw new Error('User not found');
    }
    teacherUsers.set(userTeacher.id.value, TeacherMapper.toObj(userTeacher));
    return 'Operação concluída com sucesso';
  }

  private getOrCreateBucket(masterId: string): Map<string, TeacherMapperProps> {
    let teacherUsers = this._teacherUsers.get(masterId);
    if (!teacherUsers) {
      teacherUsers = new Map<string, TeacherMapperProps>();
      this._teacherUsers.set(masterId, teacherUsers);
    }
    return teacherUsers;
  }
}
