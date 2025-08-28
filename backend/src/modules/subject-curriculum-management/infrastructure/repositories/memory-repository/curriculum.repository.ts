import Curriculum from '@/modules/subject-curriculum-management/domain/entity/curriculum.entity';
import CurriculumGateway from '../../../application/gateway/curriculum.gateway';
import { CurriculumMapper, CurriculumMapperProps } from '../../mapper/curriculum.mapper';

/**
 * In-memory implementation of CurriculumGateway.
 * Stores and manipulates curriculum records in memory.
 */
export default class MemoryCurriculumRepository implements CurriculumGateway {
  private _curriculums: Map<string, Map<string, CurriculumMapperProps>> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param curriculumsRecords - Optional initial array of curriculum records
   *  Ex.: new MemoryCurriculumRepository([{ masterId, records: [c1, c2] }])
   */
  constructor(curriculumsRecords?: Array<{ masterId: string; records: Curriculum[] }>) {
    if (curriculumsRecords) {
      for (const { masterId, records } of curriculumsRecords) {
        let curriculums = this._curriculums.get(masterId);
        if (!curriculums) {
          curriculums = new Map<string, CurriculumMapperProps>();
          this._curriculums.set(masterId, curriculums);
        }
        for (const curriculum of records) {
          curriculums.set(curriculum.id.value, CurriculumMapper.toObj(curriculum));
        }
      }
    }
  }

  /**
   * Finds a curriculum record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Curriculum or null if not found
   */
  async find(masterId: string, id: string): Promise<Curriculum | null> {
    const obj = this._curriculums.get(masterId)?.get(id);
    return obj ? CurriculumMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of curriculum records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of Curriculum entities
   */
  async findAll(
    masterId: string,
    quantity?: number,
    offSet?: number
  ): Promise<Curriculum[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const curriculums = this._curriculums.get(masterId);
    if (!curriculums) return [];
    const page = Array.from(curriculums.values()).slice(offS, offS + qtd);
    return CurriculumMapper.toInstanceList(page);
  }

  /**
   * Creates a new curriculum record.
   * @param masterId - The tenant unique identifier
   * @param curriculum - The curriculum entity to create
   * @returns Promise resolving to the id of the created curriculum
   */
  async create(masterId: string, curriculum: Curriculum): Promise<string> {
    const curriculums = this.getOrCreateBucket(masterId);
    curriculums.set(curriculum.id.value, CurriculumMapper.toObj(curriculum));
    return curriculum.id.value;
  }

  /**
   * Updates an existing curriculum.
   * @param masterId - The tenant unique identifier
   * @param curriculum - The curriculum entity with updated information
   * @returns Promise resolving to the updated Curriculum entity
   * @throws Error if the curriculum record is not found
   */
  async update(masterId: string, curriculum: Curriculum): Promise<Curriculum> {
    const curriculums = this._curriculums.get(masterId);
    if (!curriculums || !curriculums.has(curriculum.id.value)) {
      throw new Error('Curriculum not found');
    }
    curriculums.set(curriculum.id.value, CurriculumMapper.toObj(curriculum));
    return curriculum;
  }

  /**
   * Deletes a curriculum record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the curriculum record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the curriculum record is not found
   */
  async delete(masterId: string, curriculum: Curriculum): Promise<string> {
    const curriculums = this._curriculums.get(masterId);
    if (!curriculums || !curriculums.has(curriculum.id.value)) {
      throw new Error('Curriculum not found');
    }
    curriculums.set(curriculum.id.value, CurriculumMapper.toObj(curriculum));
    return 'Operação concluída com sucesso';
  }

  /**
   * Adds multiple subjects to an existing curriculum record.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the curriculum record
   * @param curriculum - The curriculum entity with updated subjects
   * @returns Promise resolving to a success message indicating number of subjects added
   * @throws Error if the curriculum record is not found or subject addition fails
   */
  async addSubjects(
    masterId: string,
    id: string,
    curriculum: Curriculum
  ): Promise<string> {
    const curriculums = this._curriculums.get(masterId);
    const obj = curriculums?.get(id);
    if (!obj) {
      throw new Error('Curriculum not found');
    }

    curriculums!.set(id, CurriculumMapper.toObj(curriculum));

    const previousCount = obj.subjectsList.length;
    const nextCount = curriculum.subjectList.length;
    const total = nextCount - previousCount;

    return `${total} ${total === 1 ? 'value was' : 'values were'} entered`;
  }

  /**
   * Removes multiple subjects from an existing curriculum record.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the curriculum record
   * @param curriculum - The curriculum entity with updated subjects
   * @returns Promise resolving to a success message indicating number of subjects removed
   * @throws Error if the curriculum record is not found or subject removal fails
   */
  async removeSubjects(
    masterId: string,
    id: string,
    curriculum: Curriculum
  ): Promise<string> {
    const curriculums = this._curriculums.get(masterId);
    const obj = curriculums?.get(id);
    if (!obj) {
      throw new Error('Curriculum not found');
    }

    curriculums!.set(id, CurriculumMapper.toObj(curriculum));

    const previousCount = obj.subjectsList.length;
    const nextCount = curriculum.subjectList.length;
    const total = previousCount - nextCount;

    return `${total} ${total === 1 ? 'value was' : 'values were'} removed`;
  }

  private getOrCreateBucket(masterId: string): Map<string, CurriculumMapperProps> {
    let curriculums = this._curriculums.get(masterId);
    if (!curriculums) {
      curriculums = new Map<string, CurriculumMapperProps>();
      this._curriculums.set(masterId, curriculums);
    }
    return curriculums;
  }
}
