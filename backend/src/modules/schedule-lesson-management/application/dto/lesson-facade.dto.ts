import {
  IFindLessonInput,
  IFindLessonOutput,
  IFindAllLessonInput,
  IFindAllLessonOutput,
  ICreateLessonInput,
  ICreateLessonOutput,
  IUpdateLessonInput,
  IUpdateLessonOutput,
  IDeleteLessonInput,
  IDeleteLessonOutput,
  IAddStudentsInput,
  IAddStudentsOutput,
  IRemoveStudentsInput,
  IRemoveStudentsOutput,
  IAddDayInput,
  IAddDayOutput,
  IRemoveDayInput,
  IRemoveDayOutput,
  IAddTimeInput,
  IAddTimeOutput,
  IRemoveTimeInput,
  IRemoveTimeOutput,
} from './base-lesson.dto';

// Facade DTOs - utilizando as interfaces base

export type FindLessonInputDto = IFindLessonInput;
export type FindLessonOutputDto = IFindLessonOutput;

export type FindAllLessonInputDto = IFindAllLessonInput;
export type FindAllLessonOutputDto = IFindAllLessonOutput;

export type CreateLessonInputDto = ICreateLessonInput;
export type CreateLessonOutputDto = ICreateLessonOutput;

export type UpdateLessonInputDto = IUpdateLessonInput;
export type UpdateLessonOutputDto = IUpdateLessonOutput;

export type DeleteLessonInputDto = IDeleteLessonInput;
export type DeleteLessonOutputDto = IDeleteLessonOutput;

export type AddStudentsInputDto = IAddStudentsInput;
export type AddStudentsOutputDto = IAddStudentsOutput;

export type RemoveStudentsInputDto = IRemoveStudentsInput;
export type RemoveStudentsOutputDto = IRemoveStudentsOutput;

export type AddDayInputDto = IAddDayInput;
export type AddDayOutputDto = IAddDayOutput;

export type RemoveDayInputDto = IRemoveDayInput;
export type RemoveDayOutputDto = IRemoveDayOutput;

export type AddTimeInputDto = IAddTimeInput;
export type AddTimeOutputDto = IAddTimeOutput;

export type RemoveTimeInputDto = IRemoveTimeInput;
export type RemoveTimeOutputDto = IRemoveTimeOutput;
