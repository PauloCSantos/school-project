export interface IFindAttendanceInput {
  id: string;
}

export interface IFindAttendanceOutput {
  id: string;
  lesson: string;
  date: Date;
  hour: string;
  day: string;
  studentsPresent: string[];
}

export interface IFindAllAttendanceInput {
  quantity?: number;
  offset?: number;
}

export interface IFindAllAttendanceItemOutput {
  id: string;
  lesson: string;
  date: Date;
  hour: string;
  day: string;
  studentsPresent: string[];
}

export interface ICreateAttendanceInput {
  lesson: string;
  date: Date;
  hour: Hour;
  day: DayOfWeek;
  studentsPresent: string[];
}

export interface ICreateAttendanceOutput {
  id: string;
}

export interface IUpdateAttendanceInput {
  id: string;
  lesson?: string;
  date?: Date;
  hour?: Hour;
  day?: DayOfWeek;
}

export interface IUpdateAttendanceOutput {
  id: string;
  lesson: string;
  date: Date;
  hour: string;
  day: string;
}

export interface IDeleteAttendanceInput {
  id: string;
}

export interface IDeleteAttendanceOutput {
  message: string;
}

export interface IAddStudentsInput {
  id: string;
  newStudentsList: string[];
}

export interface IAddStudentsOutput {
  message: string;
}

export interface IRemoveStudentsInput {
  id: string;
  studentsListToRemove: string[];
}

export interface IRemoveStudentsOutput {
  message: string;
}
