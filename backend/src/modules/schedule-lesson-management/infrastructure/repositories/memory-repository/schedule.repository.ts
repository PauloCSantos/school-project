import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';
import ScheduleGateway from '../../../application/gateway/schedule.gateway';
import {
  ScheduleMapper,
  ScheduleMapperProps,
} from '../../mapper/schedule.mapper';

/**
 * In-memory implementation of ScheduleGateway.
 * Stores and manipulates schedules in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryScheduleRepository implements ScheduleGateway {
  private _schedules: Map<string, Map<string, ScheduleMapperProps>> = new Map();

  /**
   * Creates a new in-memory repository.
   * @param schedulesRecords - Optional initial array of schedule records
   *  Ex.: new MemoryScheduleRepository([{ masterId, records: [a1, a2] }])
   */
  constructor(
    schedulesRecords?: Array<{ masterId: string; records: Schedule[] }>
  ) {
    if (schedulesRecords && schedulesRecords.length > 0) {
      for (const bucket of schedulesRecords) {
        const map = this.getOrCreateBucket(bucket.masterId);
        for (const schedule of bucket.records) {
          map.set(schedule.id.value, ScheduleMapper.toObj(schedule));
        }
      }
    }
  }

  /**
   * Finds a schedule by its ID.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the schedule to search for
   * @returns Promise resolving to the found Schedule or null if not found
   */
  async find(masterId: string, id: string): Promise<Schedule | null> {
    const obj = this._schedules.get(masterId)?.get(id);
    return obj ? ScheduleMapper.toInstance(obj) : null;
  }

  /**
   * Retrieves a list of schedules with optional pagination.
   * @param masterId - The tenant unique identifier
   * @param quantity - Optional limit for the number of schedules to retrieve
   * @param offSet - Optional number of schedules to skip before starting to collect
   * @returns Promise resolving to an array of Schedule entities
   */
  async findAll(
    masterId: string,
    quantity?: number,
    offSet?: number
  ): Promise<Schedule[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const schedules = this._schedules.get(masterId);
    if (!schedules) return [];
    const page = Array.from(schedules.values()).slice(offS, offS + qtd);
    return ScheduleMapper.toInstanceList(page);
  }

  /**
   * Creates a new schedule in memory.
   * @param masterId - The tenant unique identifier
   * @param schedule - The schedule entity to be created
   * @returns Promise resolving to the ID of the created schedule
   */
  async create(masterId: string, schedule: Schedule): Promise<string> {
    const schedules = this.getOrCreateBucket(masterId);
    schedules.set(schedule.id.value, ScheduleMapper.toObj(schedule));
    return schedule.id.value;
  }

  /**
   * Updates an existing schedule identified by ID.
   * @param masterId - The tenant unique identifier
   * @param schedule - The schedule entity with updated information
   * @returns Promise resolving to the updated Schedule entity
   * @throws Error if the schedule is not found
   */
  async update(masterId: string, schedule: Schedule): Promise<Schedule> {
    const schedules = this._schedules.get(masterId);
    if (!schedules || !schedules.has(schedule.id.value)) {
      throw new Error('Schedule not found');
    }
    schedules.set(schedule.id.value, ScheduleMapper.toObj(schedule));
    return schedule;
  }

  /**
   * Deletes a schedule by its ID.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the schedule to delete
   * @returns Promise resolving to a success message
   * @throws Error if the schedule is not found
   */
  async delete(masterId: string, id: string): Promise<string> {
    const schedules = this._schedules.get(masterId);
    if (!schedules || !schedules.has(id)) {
      throw new Error('Schedule not found');
    }
    schedules.delete(id);
    return 'Operação concluída com sucesso';
  }

  /**
   * Adds lessons to a schedule.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the schedule to update
   * @param schedule - Array of lesson IDs to add
   * @returns Promise resolving to a success message
   * @throws Error if the schedule is not found or if adding lessons fails
   */
  async addLessons(
    masterId: string,
    id: string,
    schedule: Schedule
  ): Promise<string> {
    const schedules = this._schedules.get(masterId);
    const obj = schedules?.get(id);
    if (!obj) {
      throw new Error('Schedule not found');
    }
    schedules!.set(id, ScheduleMapper.toObj(schedule));
    const totalLessons = schedule.lessonsList.length - obj.lessonsList.length;
    return `${totalLessons} ${
      totalLessons === 1 ? 'value was' : 'values were'
    } entered`;
  }

  /**
   * Removes lessons from a schedule.
   * @param masterId - The tenant unique identifier
   * @param id - The ID of the schedule to update
   * @param schedule - Array of lesson IDs to remove
   * @returns Promise resolving to a success message
   * @throws Error if the schedule is not found or if removing lessons fails
   */
  async removeLessons(
    masterId: string,
    id: string,
    schedule: Schedule
  ): Promise<string> {
    const schedules = this._schedules.get(masterId);
    const obj = schedules?.get(id);
    if (!obj) {
      throw new Error('Schedule not found');
    }
    schedules!.set(id, ScheduleMapper.toObj(schedule));
    const totalLessons = obj.lessonsList.length - schedule.lessonsList.length;
    return `${totalLessons} ${
      totalLessons === 1 ? 'value was' : 'values were'
    } removed`;
  }

  private getOrCreateBucket(
    masterId: string
  ): Map<string, ScheduleMapperProps> {
    let schedules = this._schedules.get(masterId);
    if (!schedules) {
      schedules = new Map<string, ScheduleMapperProps>();
      this._schedules.set(masterId, schedules);
    }
    return schedules;
  }
}
