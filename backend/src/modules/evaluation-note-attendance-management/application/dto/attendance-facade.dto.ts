export interface FindAttendanceInputDto {
  id: string;
}
export interface FindAttendanceOutputDto {
  id: string;
  lesson: string;
  date: Date;
  hour: string;
  day: string;
  studentsPresent: string[];
}

export interface FindAllAttendanceInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllAttendanceOutputDto
  extends Array<{
    id: string;
    lesson: string;
    date: Date;
    hour: string;
    day: string;
    studentsPresent: string[];
  }> {}

export interface CreateAttendanceInputDto {
  lesson: string;
  date: Date;
  hour: Hour;
  day: DayOfWeek;
  studentsPresent: string[];
}
export interface CreateAttendanceOutputDto {
  id: string;
}

export interface UpdateAttendanceInputDto {
  id: string;
  lesson?: string;
  date?: Date;
  hour?: Hour;
  day?: DayOfWeek;
}
export interface UpdateAttendanceOutputDto {
  id: string;
  lesson: string;
  date: Date;
  hour: string;
  day: string;
}

export interface DeleteAttendanceInputDto {
  id: string;
}
export interface DeleteAttendanceOutputDto {
  message: string;
}

export interface AddStudentsInputDto {
  id: string;
  newStudentsList: string[];
}
export interface AddStudentsOutputDto {
  message: string;
}

export interface RemoveStudentsInputDto {
  id: string;
  studentsListToRemove: string[];
}
export interface RemoveStudentsOutputDto {
  message: string;
}
