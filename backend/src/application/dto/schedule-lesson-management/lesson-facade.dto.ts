export interface FindLessonInputDto {
  id: string;
}
export interface FindLessonOutputDto {
  name: string;
  duration: number;
  teacher: string;
  studentsList: string[];
  subject: string;
  days: string[];
  times: string[];
  semester: number;
}

export interface FindAllLessonInputDto {
  quantity?: number;
  offset?: number;
}
export interface FindAllLessonOutputDto
  extends Array<{
    name: string;
    duration: number;
    teacher: string;
    studentsList: string[];
    subject: string;
    days: string[];
    times: string[];
    semester: number;
  }> {}

export interface CreateLessonInputDto {
  name: string;
  duration: number;
  teacher: string;
  studentsList: string[];
  subject: string;
  days: DayOfWeek[];
  times: Hour[];
  semester: 1 | 2;
}
export interface CreateLessonOutputDto {
  id: string;
}

export interface UpdateLessonInputDto {
  id: string;
  name?: string;
  duration?: number;
  teacher?: string;
  subject?: string;
  semester?: 1 | 2;
}
export interface UpdateLessonOutputDto {
  name: string;
  duration: number;
  teacher: string;
  subject: string;
  semester: number;
}

export interface DeleteLessonInputDto {
  id: string;
}
export interface DeleteLessonOutputDto {
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

export interface AddDayInputDto {
  id: string;
  newDaysList: string[];
}
export interface AddDayOutputDto {
  message: string;
}

export interface RemoveDayInputDto {
  id: string;
  daysListToRemove: string[];
}
export interface RemoveDayOutputDto {
  message: string;
}

export interface AddTimeInputDto {
  id: string;
  newTimesList: string[];
}
export interface AddTimeOutputDto {
  message: string;
}

export interface RemoveTimeInputDto {
  id: string;
  timesListToRemove: string[];
}
export interface RemoveTimeOutputDto {
  message: string;
}
