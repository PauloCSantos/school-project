import Attendance from '../../../modules/evaluation-note-attendance-management/domain/entity/attendance.entity';

export default interface AttendanceGateway {
  find(id: string): Promise<Attendance | undefined>;
  findAll(quantity?: number, offSet?: number): Promise<Attendance[]>;
  create(attendance: Attendance): Promise<string>;
  update(attendance: Attendance): Promise<Attendance>;
  delete(id: string): Promise<string>;
  addStudent(id: string, newStudentsList: string[]): Promise<string>;
  removeStudent(id: string, studentsListToRemove: string[]): Promise<string>;
}
