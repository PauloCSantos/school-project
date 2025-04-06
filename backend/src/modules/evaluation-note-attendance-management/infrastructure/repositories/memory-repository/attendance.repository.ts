import Attendance from '@/modules/evaluation-note-attendance-management/domain/entity/attendance.entity';
import AttendanceGateway from '../../gateway/attendance.gateway';

export default class MemoryAttendanceRepository implements AttendanceGateway {
  private _attendance: Attendance[];

  constructor(attendances?: Attendance[]) {
    attendances ? (this._attendance = attendances) : (this._attendance = []);
  }

  async find(id: string): Promise<Attendance | undefined> {
    const attendance = this._attendance.find(
      attendance => attendance.id.value === id
    );
    if (attendance) {
      return attendance;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Attendance[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const attendances = this._attendance.slice(offS, qtd);

    return attendances;
  }
  async create(attendance: Attendance): Promise<string> {
    this._attendance.push(attendance);
    return attendance.id.value;
  }
  async update(attendance: Attendance): Promise<Attendance> {
    const attendanceIndex = this._attendance.findIndex(
      dbAttendance => dbAttendance.id.value === attendance.id.value
    );
    if (attendanceIndex !== -1) {
      return (this._attendance[attendanceIndex] = attendance);
    } else {
      throw new Error('Attendance not found');
    }
  }
  async delete(id: string): Promise<string> {
    const attendanceIndex = this._attendance.findIndex(
      dbAttendance => dbAttendance.id.value === id
    );
    if (attendanceIndex !== -1) {
      this._attendance.splice(attendanceIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Attendance not found');
    }
  }
  async addStudent(id: string, newAttendancesList: string[]): Promise<string> {
    const attendanceIndex = this._attendance.findIndex(
      dbAttendance => dbAttendance.id.value === id
    );
    if (attendanceIndex !== -1) {
      try {
        const updatedAttendance = this._attendance[attendanceIndex];
        newAttendancesList.forEach(id => {
          updatedAttendance.addStudent(id);
        });
        this._attendance[attendanceIndex] = updatedAttendance;
        return `${newAttendancesList.length} ${
          newAttendancesList.length === 1 ? 'value was' : 'values were'
        } entered`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Attendance not found');
    }
  }
  async removeStudent(
    id: string,
    attendancesListToRemove: string[]
  ): Promise<string> {
    const attendanceIndex = this._attendance.findIndex(
      dbAttendance => dbAttendance.id.value === id
    );
    if (attendanceIndex !== -1) {
      try {
        const updatedAttendance = this._attendance[attendanceIndex];
        attendancesListToRemove.forEach(id => {
          updatedAttendance.removeStudent(id);
        });
        this._attendance[attendanceIndex] = updatedAttendance;
        return `${attendancesListToRemove.length} ${
          attendancesListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Attendance not found');
    }
  }
}
