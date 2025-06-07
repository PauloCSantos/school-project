// Interfaces base para Find
export interface IFindScheduleInput {
  id: string;
}

export interface IFindScheduleOutput {
  id: string;
  student: string;
  curriculum: string;
  lessonsList: string[];
}

// Interfaces base para FindAll
export interface IFindAllScheduleInput {
  quantity?: number;
  offset?: number;
}

export interface IFindAllScheduleOutput extends Array<IFindScheduleOutput> {}

// Interfaces base para Create
export interface ICreateScheduleInput {
  student: string;
  curriculum: string;
  lessonsList: string[];
}

export interface ICreateScheduleOutput {
  id: string;
}

// Interfaces base para Update
export interface IUpdateScheduleInput {
  id: string;
  curriculum?: string;
}

export interface IUpdateScheduleOutput {
  id: string;
  curriculum: string;
}

// Interfaces base para Delete
export interface IDeleteScheduleInput {
  id: string;
}

export interface IDeleteScheduleOutput {
  message: string;
}

// Interfaces base para AddLessons
export interface IAddLessonsInput {
  id: string;
  newLessonsList: string[];
}

export interface IAddLessonsOutput {
  message: string;
}

// Interfaces base para RemoveLessons
export interface IRemoveLessonsInput {
  id: string;
  lessonsListToRemove: string[];
}

export interface IRemoveLessonsOutput {
  message: string;
}
