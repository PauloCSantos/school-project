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
export interface FindAllScheduleOutputDto
  extends Array<{
    student: string;
    curriculum: string;
    lessonsList: string[];
  }> {}

export interface CreateScheduleInputDto {
  student: string;
  curriculum: string;
  lessonsList: string[];
}
export interface CreateScheduleOutputDto {
  id: string;
}

export interface UpdateScheduleInputDto {
  id: string;
  curriculum?: string;
}
export interface UpdateScheduleOutputDto {
  curriculum: string;
}

export interface DeleteScheduleInputDto {
  id: string;
}
export interface DeleteScheduleOutputDto {
  message: string;
}

export interface AddLessonsInputDto {
  id: string;
  newLessonsList: string[];
}
export interface AddLessonsOutputDto {
  message: string;
}

export interface RemoveLessonsInputDto {
  id: string;
  lessonsListToRemove: string[];
}
export interface RemoveLessonsOutputDto {
  message: string;
}
