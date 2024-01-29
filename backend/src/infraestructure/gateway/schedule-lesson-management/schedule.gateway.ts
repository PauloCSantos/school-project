import Schedule from '../../../modules/schedule-lesson-management/domain/entity/schedule.entity';

export default interface ScheduleGateway {
  find(id: string): Promise<Schedule | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Schedule[]>;
  create(schedule: Schedule): Promise<string>;
  update(schedule: Schedule): Promise<Schedule>;
  delete(id: string): Promise<string>;
  addLessons(id: string, newLessonsList: string[]): Promise<string>;
  removeLessons(id: string, lessonsListToRemove: string[]): Promise<string>;
}
