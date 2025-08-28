export interface IFindAttendanceOutput {
  id: string;
  lesson: string;
  date: Date;
  hour: string;
  day: string;
  studentsPresent: string[];
  state: string;
}
