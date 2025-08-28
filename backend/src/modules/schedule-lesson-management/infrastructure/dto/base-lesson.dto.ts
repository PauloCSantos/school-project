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
  state: string;
}
