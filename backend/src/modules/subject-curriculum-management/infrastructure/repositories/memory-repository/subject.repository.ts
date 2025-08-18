import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';
import SubjectGateway from '../../../application/gateway/subject.gateway';
import { SubjectMapper, SubjectMapperProps } from '../../mapper/subject.mapper';

/**
 * In-memory implementation of SubjectGateway.
 * Stores and manipulates subject records in memory.
 */
export default class MemorySubjectRepository implements SubjectGateway {
  private _subjects: Map<string, Map<string, SubjectMapperProps>> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param subjectsRecords - Optional initial array of subject records
   *  Ex.: new MemorySubjectRepository([{ masterId, records: [s1, s2] }])
   */
  constructor(
    subjectsRecords?: Array<{ masterId: string; records: Subject[] }>
  ) {
    if (subjectsRecords) {
      for (const { masterId, records } of subjectsRecords) {
        let subjects = this._subjects.get(masterId);
        if (!subjects) {
          subjects = new Map<string, SubjectMapperProps>();
          this._subjects.set(masterId, subjects);
        }
        for (const subject of records) {
          subjects.set(subject.id.value, SubjectMapper.toObj(subject));
        }
      }
    }
  }

  /**
   * Finds a subject record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Subject or null if not found
   */
  async find(masterId: string, id: string): Promise<Subject | null> {
    const obj = this._subjects.get(masterId)?.get(id);
    return obj ? SubjectMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of subject records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of Subject entities
   */
  async findAll(
    masterId: string,
    quantity?: number,
    offSet?: number
  ): Promise<Subject[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const subjects = this._subjects.get(masterId);
    if (!subjects) return [];
    const page = Array.from(subjects.values()).slice(offS, offS + qtd);
    return SubjectMapper.toInstanceList(page);
  }

  /**
   * Creates a new subject record.
   * @param masterId - The tenant unique identifier
   * @param subject - The subject entity to create
   * @returns Promise resolving to the id of the created subject
   */
  async create(masterId: string, subject: Subject): Promise<string> {
    const subjects = this.getOrCreateBucket(masterId);
    subjects.set(subject.id.value, SubjectMapper.toObj(subject));
    return subject.id.value;
  }

  /**
   * Updates an existing subject.
   * @param masterId - The tenant unique identifier
   * @param subject - The subject entity with updated information
   * @returns Promise resolving to the updated Subject entity
   * @throws Error if the subject record is not found
   */
  async update(masterId: string, subject: Subject): Promise<Subject> {
    const subjects = this._subjects.get(masterId);
    if (!subjects || !subjects.has(subject.id.value)) {
      throw new Error('Subject not found');
    }
    subjects.set(subject.id.value, SubjectMapper.toObj(subject));
    return subject;
  }

  /**
   * Deletes a subject record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the subject record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the subject record is not found
   */
  async delete(masterId: string, id: string): Promise<string> {
    const subjects = this._subjects.get(masterId);
    if (!subjects || !subjects.has(id)) {
      throw new Error('Subject not found');
    }
    subjects.delete(id);
    return 'Operação concluída com sucesso';
  }

  private getOrCreateBucket(masterId: string): Map<string, SubjectMapperProps> {
    let subjects = this._subjects.get(masterId);
    if (!subjects) {
      subjects = new Map<string, SubjectMapperProps>();
      this._subjects.set(masterId, subjects);
    }
    return subjects;
  }
}
