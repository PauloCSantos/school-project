import {
  IFindAttendanceInput,
  IFindAttendanceOutput,
  IFindAllAttendanceInput,
  IFindAllAttendanceItemOutput,
  ICreateAttendanceInput,
  ICreateAttendanceOutput,
  IUpdateAttendanceInput,
  IUpdateAttendanceOutput,
  IDeleteAttendanceInput,
  IDeleteAttendanceOutput,
  IAddStudentsInput,
  IAddStudentsOutput,
  IRemoveStudentsInput,
  IRemoveStudentsOutput,
} from './base-attendance.dto';

export type FindAttendanceInputDto = IFindAttendanceInput;
export type FindAttendanceOutputDto = IFindAttendanceOutput;

export type FindAllAttendanceInputDto = IFindAllAttendanceInput;
export type FindAllAttendanceOutputDto = Array<IFindAllAttendanceItemOutput>;

export type CreateAttendanceInputDto = ICreateAttendanceInput;
export type CreateAttendanceOutputDto = ICreateAttendanceOutput;

export type UpdateAttendanceInputDto = IUpdateAttendanceInput;
export type UpdateAttendanceOutputDto = IUpdateAttendanceOutput;

export type DeleteAttendanceInputDto = IDeleteAttendanceInput;
export type DeleteAttendanceOutputDto = IDeleteAttendanceOutput;

export type AddStudentsInputDto = IAddStudentsInput;
export type AddStudentsOutputDto = IAddStudentsOutput;

export type RemoveStudentsInputDto = IRemoveStudentsInput;
export type RemoveStudentsOutputDto = IRemoveStudentsOutput;
