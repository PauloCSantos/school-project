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

export default interface AttendanceFacadeInterface {
  create(input: CreateAttendanceInputDto): Promise<CreateAttendanceOutputDto>;
  find(
    input: FindAttendanceInputDto
  ): Promise<FindAttendanceOutputDto | undefined>;
  findAll(
    input: FindAllAttendanceInputDto
  ): Promise<FindAllAttendanceOutputDto>;
  delete(input: DeleteAttendanceInputDto): Promise<DeleteAttendanceOutputDto>;
  update(input: UpdateAttendanceInputDto): Promise<UpdateAttendanceOutputDto>;
  addStudents(input: AddStudentsInputDto): Promise<AddStudentsOutputDto>;
  removeStudents(
    input: RemoveStudentsInputDto
  ): Promise<RemoveStudentsOutputDto>;
}
