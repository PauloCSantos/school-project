import AddStudents from '@/application/usecases/evaluation-note-attendance-management/attendance/addStudents.usecase';
import CreateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/createAttendance.usecase';
import DeleteAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/deleteAttendance.usecase';
import FindAllAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAllAttendance.usecase';
import FindAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/findAttendance.usecase';
import RemoveStudents from '@/application/usecases/evaluation-note-attendance-management/attendance/removeStudents.usecase';
import UpdateAttendance from '@/application/usecases/evaluation-note-attendance-management/attendance/updateAttendance.usecase';
import AttendanceFacadeInterface from '../interface/attendance-facade.interface';
import {
  CreateAttendanceInputDto,
  AddStudentsInputDto,
  AddStudentsOutputDto,
  CreateAttendanceOutputDto,
  DeleteAttendanceInputDto,
  DeleteAttendanceOutputDto,
  FindAllAttendanceInputDto,
  FindAllAttendanceOutputDto,
  FindAttendanceInputDto,
  FindAttendanceOutputDto,
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
  UpdateAttendanceInputDto,
  UpdateAttendanceOutputDto,
} from '@/application/dto/evaluation-note-attendance-management/attendance-facade.dto';

type AttendanceFacadeProps = {
  createAttendance: CreateAttendance;
  deleteAttendance: DeleteAttendance;
  findAllAttendance: FindAllAttendance;
  findAttendance: FindAttendance;
  updateAttendance: UpdateAttendance;
  addStudents: AddStudents;
  removeStudents: RemoveStudents;
};
export default class AttendanceFacade implements AttendanceFacadeInterface {
  private _createAttendance: CreateAttendance;
  private _deleteAttendance: DeleteAttendance;
  private _findAllAttendance: FindAllAttendance;
  private _findAttendance: FindAttendance;
  private _updateAttendance: UpdateAttendance;
  private _addStudents: AddStudents;
  private _removeStudents: RemoveStudents;

  constructor(input: AttendanceFacadeProps) {
    this._createAttendance = input.createAttendance;
    this._deleteAttendance = input.deleteAttendance;
    this._findAllAttendance = input.findAllAttendance;
    this._findAttendance = input.findAttendance;
    this._updateAttendance = input.updateAttendance;
    this._addStudents = input.addStudents;
    this._removeStudents = input.removeStudents;
  }

  async create(
    input: CreateAttendanceInputDto
  ): Promise<CreateAttendanceOutputDto> {
    return await this._createAttendance.execute(input);
  }
  async find(
    input: FindAttendanceInputDto
  ): Promise<FindAttendanceOutputDto | undefined> {
    return await this._findAttendance.execute(input);
  }
  async findAll(
    input: FindAllAttendanceInputDto
  ): Promise<FindAllAttendanceOutputDto> {
    return await this._findAllAttendance.execute(input);
  }
  async delete(
    input: DeleteAttendanceInputDto
  ): Promise<DeleteAttendanceOutputDto> {
    return await this._deleteAttendance.execute(input);
  }
  async update(
    input: UpdateAttendanceInputDto
  ): Promise<UpdateAttendanceOutputDto> {
    return await this._updateAttendance.execute(input);
  }
  async addStudents(input: AddStudentsInputDto): Promise<AddStudentsOutputDto> {
    return await this._addStudents.execute(input);
  }
  async removeStudents(
    input: RemoveStudentsInputDto
  ): Promise<RemoveStudentsOutputDto> {
    return await this._removeStudents.execute(input);
  }
}
