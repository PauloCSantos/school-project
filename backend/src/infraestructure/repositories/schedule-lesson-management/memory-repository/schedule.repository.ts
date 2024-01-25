import Schedule from '@/modules/schedule-lesson-management/schedule/domain/entity/schedule.entity';
import ScheduleGateway from '@/modules/schedule-lesson-management/schedule/gateway/schedule.gateway';

export default class MemoryScheduleRepository implements ScheduleGateway {
  private _schedule: Schedule[];

  constructor(schedules: Schedule[]) {
    schedules ? (this._schedule = schedules) : (this._schedule = []);
  }

  async find(id: string): Promise<Schedule | undefined> {
    const schedule = this._schedule.find(schedule => schedule.id.id === id);
    if (schedule) {
      return schedule;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Schedule[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const schedules = this._schedule.slice(offS, qtd);

    return schedules;
  }
  async create(schedule: Schedule): Promise<string> {
    this._schedule.push(schedule);
    return schedule.id.id;
  }
  async update(schedule: Schedule): Promise<Schedule> {
    const scheduleIndex = this._schedule.findIndex(
      dbSchedule => dbSchedule.id.id === schedule.id.id
    );
    if (scheduleIndex !== -1) {
      return (this._schedule[scheduleIndex] = schedule);
    } else {
      throw new Error('Schedule not found');
    }
  }
  async delete(id: string): Promise<string> {
    const scheduleIndex = this._schedule.findIndex(
      dbSchedule => dbSchedule.id.id === id
    );
    if (scheduleIndex !== -1) {
      this._schedule.splice(scheduleIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Schedule not found');
    }
  }
  async addLessons(id: string, newSchedulesList: string[]): Promise<string> {
    const scheduleIndex = this._schedule.findIndex(
      dbSchedule => dbSchedule.id.id === id
    );
    if (scheduleIndex !== -1) {
      try {
        const updatedSchedule = this._schedule[scheduleIndex];
        newSchedulesList.forEach(id => {
          updatedSchedule.addLesson(id);
        });
        this._schedule[scheduleIndex] = updatedSchedule;
        return `${newSchedulesList.length} ${
          newSchedulesList.length === 1 ? 'value was' : 'values were'
        } entered`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Schedule not found');
    }
  }
  async removeLessons(
    id: string,
    schedulesListToRemove: string[]
  ): Promise<string> {
    const scheduleIndex = this._schedule.findIndex(
      dbSchedule => dbSchedule.id.id === id
    );
    if (scheduleIndex !== -1) {
      try {
        const updatedSchedule = this._schedule[scheduleIndex];
        schedulesListToRemove.forEach(id => {
          updatedSchedule.removeLesson(id);
        });
        this._schedule[scheduleIndex] = updatedSchedule;
        return `${schedulesListToRemove.length} ${
          schedulesListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Schedule not found');
    }
  }
}
