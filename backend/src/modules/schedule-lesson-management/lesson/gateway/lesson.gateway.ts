import Lesson from '../domain/entity/lesson.entity';

export default interface LessonGateway {
  find(id: string): Promise<Omit<Lesson, 'id'> | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Omit<Lesson, 'id'>[]>;
  create(lesson: Lesson): Promise<string>;
  update(lesson: Lesson): Promise<Omit<Lesson, 'id'>>;
  delete(id: string): Promise<string>;
  addStudents(id: string, newStudentsList: string[]): Promise<string>;
  removeStudents(id: string, studentsListToRemove: string[]): Promise<string>;
  addDay(id: string, newDaysList: string[]): Promise<string>;
  removeDay(id: string, daysListToRemove: string[]): Promise<string>;
  addTime(id: string, newTimesList: string[]): Promise<string>;
  removeTime(id: string, timesListToRemove: string[]): Promise<string>;
}
