import Schedule from '../domain/entity/schedule.entity';

export default interface ScheduleGateway {
  find(id: string): Promise<Omit<Schedule, 'id'> | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Omit<Schedule, 'id'>[]>;
  create(schedule: Schedule): Promise<string>;
  update(schedule: Schedule): Promise<Omit<Schedule, 'id'>>;
  delete(id: string): Promise<string>;
  addLessons(id: string, newSchedulesList: string[]): Promise<string>;
  removeLessons(id: string, schedulesListToRemove: string[]): Promise<string>;
}
