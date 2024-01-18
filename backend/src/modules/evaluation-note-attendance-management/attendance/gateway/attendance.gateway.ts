import Attendance from '../domain/entity/attendance.entity';

export default interface AttendanceGateway {
  find(id: string): Promise<Omit<Attendance, 'id'> | undefined>;
  findAll(
    quantity?: number,
    offSet?: number
  ): Promise<Omit<Attendance, 'id'>[]>;
  create(attendance: Attendance): Promise<string>;
  update(attendance: Attendance): Promise<Omit<Attendance, 'id'>>;
  delete(id: string): Promise<string>;
  addStudent(id: string, newStudentsList: string[]): Promise<string>;
  removeStudent(id: string, studentsListToRemove: string[]): Promise<string>;
}
