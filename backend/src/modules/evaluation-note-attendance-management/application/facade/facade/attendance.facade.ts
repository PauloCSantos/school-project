import {
  AddStudentsInputDto,
  AddStudentsOutputDto,
  CreateAttendanceInputDto,
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
} from '../../dto/attendance-facade.dto';
import AddStudents from '../../usecases/attendance/add-students.usecase';
import CreateAttendance from '../../usecases/attendance/create.usecase';
import DeleteAttendance from '../../usecases/attendance/delete.usecase';
import FindAllAttendance from '../../usecases/attendance/find-all.usecase';
import FindAttendance from '../../usecases/attendance/find.usecase';
import RemoveStudents from '../../usecases/attendance/remove-students.usecase';
import UpdateAttendance from '../../usecases/attendance/update.usecase';
import AttendanceFacadeInterface from '../interface/attendance.interface';

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
