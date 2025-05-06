// Interfaces base para Find
export interface IFindLessonInput {
  id: string;
}

export interface IFindLessonOutput {
  id: string;
  name: string;
  duration: number;
  teacher: string;
  studentsList: string[];
  subject: string;
  days: string[];
  times: string[];
  semester: number;
}

// Interfaces base para FindAll
export interface IFindAllLessonInput {
  quantity?: number;
  offset?: number;
}

export interface IFindAllLessonOutput extends Array<IFindLessonOutput> {}

// Interfaces base para Create
export interface ICreateLessonInput {
  name: string;
  duration: number;
  teacher: string;
  studentsList: string[];
  subject: string;
  days: DayOfWeek[];
  times: Hour[];
  semester: 1 | 2;
}

export interface ICreateLessonOutput {
  id: string;
}

// Interfaces base para Update
export interface IUpdateLessonInput {
  id: string;
  name?: string;
  duration?: number;
  teacher?: string;
  subject?: string;
  semester?: 1 | 2;
}

export interface IUpdateLessonOutput {
  id: string;
  name: string;
  duration: number;
  teacher: string;
  subject: string;
  semester: number;
}

// Interfaces base para Delete
export interface IDeleteLessonInput {
  id: string;
}

export interface IDeleteLessonOutput {
  message: string;
}

// Interfaces base para AddStudents
export interface IAddStudentsInput {
  id: string;
  newStudentsList: string[];
}

export interface IAddStudentsOutput {
  message: string;
}

// Interfaces base para RemoveStudents
export interface IRemoveStudentsInput {
  id: string;
  studentsListToRemove: string[];
}

export interface IRemoveStudentsOutput {
  message: string;
}

// Interfaces base para AddDay
export interface IAddDayInput {
  id: string;
  newDaysList: string[];
}

export interface IAddDayOutput {
  message: string;
}

// Interfaces base para RemoveDay
export interface IRemoveDayInput {
  id: string;
  daysListToRemove: string[];
}

export interface IRemoveDayOutput {
  message: string;
}

// Interfaces base para AddTime
export interface IAddTimeInput {
  id: string;
  newTimesList: string[];
}

export interface IAddTimeOutput {
  message: string;
}

// Interfaces base para RemoveTime
export interface IRemoveTimeInput {
  id: string;
  timesListToRemove: string[];
}

export interface IRemoveTimeOutput {
  message: string;
}
