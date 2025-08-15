import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import LessonGateway from '../../../application/gateway/lesson.gateway';
import { LessonMapper, LessonMapperProps } from '../../mapper/lesson.mapper';

/**
 * In-memory implementation of LessonGateway.
 * Stores and manipulates lesson records in memory.
 */
export default class MemoryLessonRepository implements LessonGateway {
  private _lessons: Map<string, Map<string, LessonMapperProps>> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param lessonsRecords - Optional initial array of lesson records
   *  Ex.: new MemoryLessonRepository([{ masterId, records: [a1, a2] }])
   */
  constructor(lessonsRecords?: Array<{ masterId: string; records: Lesson[] }>) {
    if (lessonsRecords && lessonsRecords.length > 0) {
      for (const bucket of lessonsRecords) {
        const map = this.getOrCreateBucket(bucket.masterId);
        for (const lesson of bucket.records) {
          map.set(lesson.id.value, LessonMapper.toObj(lesson));
        }
      }
    }
  }

  /**
   * Finds an lesson record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier to search for
   * @returns Promise resolving to the found Lesson or null if not found
   */
  async find(masterId: string, id: string): Promise<Lesson | null> {
    const obj = this._lessons.get(masterId)?.get(id);
    return obj ? LessonMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a collection of lesson records with pagination support.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit on the number of records to return (defaults to 10)
   * @param offSet - Optional number of records to skip for pagination (defaults to 0)
   * @returns Promise resolving to an array of Lesson entities
   */
  async findAll(
    masterId: string,
    quantity?: number,
    offSet?: number
  ): Promise<Lesson[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const lessons = this._lessons.get(masterId);
    if (!lessons) return [];
    const page = Array.from(lessons.values()).slice(offS, offS + qtd);
    return LessonMapper.toInstanceList(page);
  }

  /**
   * Creates a new lesson record in memory.
   * @param masterId - The tenant unique identifier
   * @param lesson - The lesson entity to be created
   * @returns Promise resolving to the created lesson id
   */
  async create(masterId: string, lesson: Lesson): Promise<string> {
    const lessons = this.getOrCreateBucket(masterId);
    lessons.set(lesson.id.value, LessonMapper.toObj(lesson));
    return lesson.id.value;
  }

  /**
   * Updates an existing lesson identified by ID.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the lesson record to update
   * @param lesson - The updated lesson entity data
   * @returns Promise resolving to the updated Lesson entity
   * @throws Error if the lesson is not found
   */
  async update(masterId: string, id: string, lesson: Lesson): Promise<Lesson> {
    const lessons = this._lessons.get(masterId);
    if (!lessons || !lessons.has(id)) {
      throw new Error('Lesson not found');
    }
    lessons.set(id, LessonMapper.toObj(lesson));
    return lesson;
  }

  /**
   * Deletes an lesson record by its unique identifier.
   * @param masterId - The tenant unique identifier
   * @param id - The unique identifier of the lesson record to delete
   * @returns Promise resolving to a success message
   * @throws Error if the lesson record is not found
   */
  async delete(masterId: string, id: string): Promise<string> {
    const lessons = this._lessons.get(masterId);
    if (!lessons || !lessons.has(id)) {
      throw new Error('Lesson not found');
    }
    lessons.delete(id);
    return 'Operação concluída com sucesso';
  }

  /**
   * Adds students to a lesson.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated students
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if adding students fails
   */
  async addStudents(
    masterId: string,
    id: string,
    lesson: Lesson
  ): Promise<string> {
    const lessons = this._lessons.get(masterId);
    const obj = lessons?.get(id);
    if (!obj) {
      throw new Error('Lesson not found');
    }

    lessons!.set(id, LessonMapper.toObj(lesson));

    const totalStudents = lesson.studentsList.length - obj.studentsList.length;
    return `${totalStudents} ${
      totalStudents === 1 ? 'value was' : 'values were'
    } entered`;
  }

  /**
   * Removes students from a lesson.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated students
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if removing students fails
   */
  async removeStudents(
    masterId: string,
    id: string,
    lesson: Lesson
  ): Promise<string> {
    const lessons = this._lessons.get(masterId);
    const obj = lessons?.get(id);
    if (!obj) {
      throw new Error('Lesson not found');
    }

    lessons!.set(id, LessonMapper.toObj(lesson));

    const totalStudents = obj.studentsList.length - lesson.studentsList.length;
    return `${totalStudents} ${
      totalStudents === 1 ? 'value was' : 'values were'
    } removed`;
  }

  /**
   * Adds days to a lesson schedule.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated days
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if adding days fails
   */
  async addDay(masterId: string, id: string, lesson: Lesson): Promise<string> {
    const lessons = this._lessons.get(masterId);
    const obj = lessons?.get(id);
    if (!obj) {
      throw new Error('Lesson not found');
    }
    lessons!.set(id, LessonMapper.toObj(lesson));

    const totalStudents = lesson.days.length - obj.days.length;
    return `${totalStudents} ${
      totalStudents === 1 ? 'value was' : 'values were'
    } entered`;
  }

  /**
   * Removes days from a lesson schedule.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated days
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if removing days fails
   */
  async removeDay(
    masterId: string,
    id: string,
    lesson: Lesson
  ): Promise<string> {
    const lessons = this._lessons.get(masterId);
    const obj = lessons?.get(id);
    if (!obj) {
      throw new Error('Lesson not found');
    }

    lessons!.set(id, LessonMapper.toObj(lesson));

    const totalStudents = obj.days.length - lesson.days.length;
    return `${totalStudents} ${
      totalStudents === 1 ? 'value was' : 'values were'
    } removed`;
  }

  /**
   * Adds time slots to a lesson schedule.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated times
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if adding times fails
   */
  async addTime(masterId: string, id: string, lesson: Lesson): Promise<string> {
    const lessons = this._lessons.get(masterId);
    const obj = lessons?.get(id);
    if (!obj) {
      throw new Error('Lesson not found');
    }

    lessons!.set(id, LessonMapper.toObj(lesson));

    const totalStudents = lesson.times.length - obj.times.length;
    return `${totalStudents} ${
      totalStudents === 1 ? 'value was' : 'values were'
    } entered`;
  }

  /**
   * Removes time slots from a lesson schedule.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the lesson to update
   * @param lesson - The lesson entity with updated days
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if removing times fails
   */
  async removeTime(
    masterId: string,
    id: string,
    lesson: Lesson
  ): Promise<string> {
    const lessons = this._lessons.get(masterId);
    const obj = lessons?.get(id);
    if (!obj) {
      throw new Error('Lesson not found');
    }

    lessons!.set(id, LessonMapper.toObj(lesson));

    const totalStudents = obj.times.length - lesson.times.length;
    return `${totalStudents} ${
      totalStudents === 1 ? 'value was' : 'values were'
    } removed`;
  }

  private getOrCreateBucket(masterId: string): Map<string, LessonMapperProps> {
    let lessons = this._lessons.get(masterId);
    if (!lessons) {
      lessons = new Map<string, LessonMapperProps>();
      this._lessons.set(masterId, lessons);
    }
    return lessons;
  }
}
