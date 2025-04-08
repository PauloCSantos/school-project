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
} from '../../application/dto/attendance-usecase.dto';
import AddStudents from '../../application/usecases/attendance/addStudents.usecase';
import CreateAttendance from '../../application/usecases/attendance/createAttendance.usecase';
import DeleteAttendance from '../../application/usecases/attendance/deleteAttendance.usecase';
import FindAllAttendance from '../../application/usecases/attendance/findAllAttendance.usecase';
import FindAttendance from '../../application/usecases/attendance/findAttendance.usecase';
import RemoveStudents from '../../application/usecases/attendance/removeStudents.usecase';
import UpdateAttendance from '../../application/usecases/attendance/updateAttendance.usecase';

export class AttendanceController {
  constructor(
    private readonly createAttendance: CreateAttendance,
    private readonly findAttendance: FindAttendance,
    private readonly findAllAttendance: FindAllAttendance,
    private readonly updateAttendance: UpdateAttendance,
    private readonly deleteAttendance: DeleteAttendance,
    private readonly addStudentstoAttendance: AddStudents,
    private readonly removeStudentstoAttendance: RemoveStudents
  ) {}

  async create(
    input: CreateAttendanceInputDto
  ): Promise<CreateAttendanceOutputDto> {
    const response = await this.createAttendance.execute(input);
    return response;
  }
  async find(
    input: FindAttendanceInputDto
  ): Promise<FindAttendanceOutputDto | undefined> {
    const response = await this.findAttendance.execute(input);
    return response;
  }
  async findAll(
    input: FindAllAttendanceInputDto
  ): Promise<FindAllAttendanceOutputDto> {
    const response = await this.findAllAttendance.execute(input);
    return response;
  }
  async delete(
    input: DeleteAttendanceInputDto
  ): Promise<DeleteAttendanceOutputDto> {
    const response = await this.deleteAttendance.execute(input);
    return response;
  }
  async update(
    input: UpdateAttendanceInputDto
  ): Promise<UpdateAttendanceOutputDto> {
    const response = await this.updateAttendance.execute(input);
    return response;
  }
  async addStudents(input: AddStudentsInputDto): Promise<AddStudentsOutputDto> {
    const response = await this.addStudentstoAttendance.execute(input);
    return response;
  }
  async removeStudents(
    input: RemoveStudentsInputDto
  ): Promise<RemoveStudentsOutputDto> {
    const response = await this.removeStudentstoAttendance.execute(input);
    return response;
  }
}
