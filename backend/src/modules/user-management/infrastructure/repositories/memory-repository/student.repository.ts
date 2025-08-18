import UserStudentGateway from '../../../application/gateway/student.gateway';
import UserStudent from '@/modules/user-management/domain/entity/student.entity';
import { StudentMapper, StudentMapperProps } from '../../mapper/student.mapper';

/**
 * In-memory implementation of StudentGateway.
 * Stores and manipulates student records in memory.
 */
export default class MemoryUserStudentRepository implements UserStudentGateway {
  private _studentUsers: Map<string, Map<string, StudentMapperProps>> =
    new Map();

  /**
   * Creates a new in-memory repository.
   * @param studentRecords - Optional initial array of student records
   * Ex.: new MemoryUserStudentRepository([{ masterId, records: [s1, s2] }])
   */
  constructor(
    studentRecords?: Array<{
      masterId: string;
      records: UserStudent[];
    }>
  ) {
    if (studentRecords) {
      for (const { masterId, records } of studentRecords) {
        let studentUsers = this._studentUsers.get(masterId);
        if (!studentUsers) {
          studentUsers = new Map<string, StudentMapperProps>();
          this._studentUsers.set(masterId, studentUsers);
        }
        for (const userStudent of records) {
          studentUsers.set(
            userStudent.id.value,
            StudentMapper.toObj(userStudent)
          );
        }
      }
    }
  }

  /**
   * Finds a student record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found student or null if not found
   */
  async find(masterId: string, id: string): Promise<UserStudent | null> {
    const obj = this._studentUsers.get(masterId)?.get(id);
    return obj ? StudentMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of student records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of UserStudent entities
   */
  async findAll(
    masterId: string,
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<UserStudent[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const studentUsers = this._studentUsers.get(masterId);
    if (!studentUsers) return [];
    const page = Array.from(studentUsers.values()).slice(offS, offS + qtd);
    return StudentMapper.toInstanceList(page);
  }

  /**
   * Finds a student record by email.
   * @param masterId - The tenant unique identifier
   * @param email - The email to search for
   * @returns Promise resolving to the found student or null if not found
   */
  async findByEmail(
    masterId: string,
    email: string
  ): Promise<UserStudent | null> {
    const studentUsers = this._studentUsers.get(masterId);
    if (!studentUsers) return null;
    for (const userStudent of studentUsers.values()) {
      if (userStudent.email === email)
        return StudentMapper.toInstance(userStudent);
    }
    return null;
  }

  /**
   * Creates a new student record in memory.
   * @param masterId - The tenant unique identifier
   * @param userStudent - The student entity to be created
   * @returns Promise resolving to the unique identifier of the created student record
   */
  async create(masterId: string, userStudent: UserStudent): Promise<string> {
    const studentUsers = this.getOrCreateBucket(masterId);
    studentUsers.set(userStudent.id.value, StudentMapper.toObj(userStudent));
    return userStudent.id.value;
  }

  /**
   * Updates an existing student record identified by its ID.
   * @param masterId - The tenant unique identifier
   * @param userStudent - The student entity with updated information
   * @returns Promise resolving to the updated UserStudent entity
   * @throws Error if the student record is not found
   */
  async update(
    masterId: string,
    userStudent: UserStudent
  ): Promise<UserStudent> {
    const studentUsers = this._studentUsers.get(masterId);
    if (!studentUsers || !studentUsers.has(userStudent.id.value)) {
      throw new Error('User not found');
    }
    studentUsers.set(userStudent.id.value, StudentMapper.toObj(userStudent));
    return userStudent;
  }

  /**
   * Deletes a student record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the student record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the student record is not found
   */
  async delete(masterId: string, id: string): Promise<string> {
    const studentUsers = this._studentUsers.get(masterId);
    if (!studentUsers || !studentUsers.has(id)) {
      throw new Error('User not found');
    }
    studentUsers.delete(id);
    return 'Operação concluída com sucesso';
  }

  private getOrCreateBucket(masterId: string): Map<string, StudentMapperProps> {
    let studentUsers = this._studentUsers.get(masterId);
    if (!studentUsers) {
      studentUsers = new Map<string, StudentMapperProps>();
      this._studentUsers.set(masterId, studentUsers);
    }
    return studentUsers;
  }
}
