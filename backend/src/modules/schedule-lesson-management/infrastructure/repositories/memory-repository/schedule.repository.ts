import Schedule from '@/modules/schedule-lesson-management/domain/entity/schedule.entity';
import ScheduleGateway from '../../gateway/schedule.gateway';

/**
 * In-memory implementation of ScheduleGateway.
 * Stores and manipulates schedules in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryScheduleRepository implements ScheduleGateway {
  private _schedule: Schedule[];

  /**
   * Creates a new in-memory repository.
   * @param schedules - Optional initial array of schedules
   */
  constructor(schedules?: Schedule[]) {
    schedules ? (this._schedule = schedules) : (this._schedule = []);
  }

  /**
   * Finds a schedule by its ID.
   * @param id - The ID of the schedule to search for
   * @returns Promise resolving to the found Schedule or null if not found
   */
  async find(id: string): Promise<Schedule | null> {
    const schedule = this._schedule.find(schedule => schedule.id.value === id);
    if (schedule) {
      return schedule;
    } else {
      return null;
    }
  }

  /**
   * Retrieves a list of schedules with optional pagination.
   * @param quantity - Optional limit for the number of schedules to retrieve
   * @param offSet - Optional number of schedules to skip before starting to collect
   * @returns Promise resolving to an array of Schedule entities
   */
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Schedule[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const schedules = this._schedule.slice(offS, qtd);

    return schedules;
  }

  /**
   * Creates a new schedule in memory.
   * @param schedule - The schedule entity to be created
   * @returns Promise resolving to the ID of the created schedule
   */
  async create(schedule: Schedule): Promise<string> {
    this._schedule.push(schedule);
    return schedule.id.value;
  }

  /**
   * Updates an existing schedule identified by ID.
   * @param schedule - The schedule entity with updated information
   * @returns Promise resolving to the updated Schedule entity
   * @throws Error if the schedule is not found
   */
  async update(schedule: Schedule): Promise<Schedule> {
    const scheduleIndex = this._schedule.findIndex(
      dbSchedule => dbSchedule.id.value === schedule.id.value
    );
    if (scheduleIndex !== -1) {
      return (this._schedule[scheduleIndex] = schedule);
    } else {
      throw new Error('Schedule not found');
    }
  }

  /**
   * Deletes a schedule by its ID.
   * @param id - The ID of the schedule to delete
   * @returns Promise resolving to a success message
   * @throws Error if the schedule is not found
   */
  async delete(id: string): Promise<string> {
    const scheduleIndex = this._schedule.findIndex(
      dbSchedule => dbSchedule.id.value === id
    );
    if (scheduleIndex !== -1) {
      this._schedule.splice(scheduleIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Schedule not found');
    }
  }

  /**
   * Adds lessons to a schedule.
   * @param id - The ID of the schedule to update
   * @param newLessonsList - Array of lesson IDs to add
   * @returns Promise resolving to a success message
   * @throws Error if the schedule is not found or if adding lessons fails
   */
  async addLessons(id: string, newLessonsList: string[]): Promise<string> {
    const scheduleIndex = this._schedule.findIndex(
      dbSchedule => dbSchedule.id.value === id
    );
    if (scheduleIndex !== -1) {
      try {
        const updatedSchedule = this._schedule[scheduleIndex];
        newLessonsList.forEach(id => {
          updatedSchedule.addLesson(id);
        });
        this._schedule[scheduleIndex] = updatedSchedule;
        return `${newLessonsList.length} ${
          newLessonsList.length === 1 ? 'value was' : 'values were'
        } entered`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Schedule not found');
    }
  }

  /**
   * Removes lessons from a schedule.
   * @param id - The ID of the schedule to update
   * @param lessonsListToRemove - Array of lesson IDs to remove
   * @returns Promise resolving to a success message
   * @throws Error if the schedule is not found or if removing lessons fails
   */
  async removeLessons(
    id: string,
    lessonsListToRemove: string[]
  ): Promise<string> {
    const scheduleIndex = this._schedule.findIndex(
      dbSchedule => dbSchedule.id.value === id
    );
    if (scheduleIndex !== -1) {
      try {
        const updatedSchedule = this._schedule[scheduleIndex];
        lessonsListToRemove.forEach(id => {
          updatedSchedule.removeLesson(id);
        });
        this._schedule[scheduleIndex] = updatedSchedule;
        return `${lessonsListToRemove.length} ${
          lessonsListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Schedule not found');
    }
  }
}
