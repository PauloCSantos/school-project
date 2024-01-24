export interface FindScheduleInputDto {
  id: string;
}
export interface FindScheduleOutputDto {
  student: string;
  curriculum: string;
  lessonsList: string[];
}

export interface FindAllScheduleInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllScheduleOutputDto {
  student: string;
  curriculum: string;
  lessonsList: string[];
}
[];

export interface CreateScheduleInputDto {
  id: string;
  student: string;
  curriculum: string;
  lessonsList: string[];
}
export interface CreateScheduleOutputDto {
  id: string;
}

export interface UpdateScheduleInputDto {
  id: string;
  student?: string;
  curriculum?: string;
  lessonsList?: string[];
}
export interface UpdateScheduleOutputDto {
  student: string;
  curriculum: string;
  lessonsList: string[];
}

export interface DeleteScheduleInputDto {
  id: string;
}
export interface DeleteScheduleOutputDto {
  message: string;
}

export interface AddLessonsInputDto {
  id: string;
  newSchedulesList: string[];
}
export interface AddLessonsOutputDto {
  message: string;
}

export interface RemoveLessonsInputDto {
  id: string;
  schedulesListToRemove: string[];
}
export interface RemoveLessonsOutputDto {
  message: string;
}
