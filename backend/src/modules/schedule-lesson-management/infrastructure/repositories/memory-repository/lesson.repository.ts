import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import LessonGateway from '../../gateway/lesson.gateway';

export default class MemoryLessonRepository implements LessonGateway {
  private _lessons: Lesson[];

  constructor(lessons?: Lesson[]) {
    lessons ? (this._lessons = lessons) : (this._lessons = []);
  }

  async find(id: string): Promise<Lesson | undefined> {
    const lesson = this._lessons.find(lesson => lesson.id.value === id);
    if (lesson) {
      return lesson;
    } else {
      return undefined;
    }
  }
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Lesson[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity + offS : 10;
    const lessons = this._lessons.slice(offS, qtd);

    return lessons;
  }
  async create(lesson: Lesson): Promise<string> {
    this._lessons.push(lesson);
    return lesson.id.value;
  }
  async update(lesson: Lesson): Promise<Lesson> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === lesson.id.value
    );
    if (lessonIndex !== -1) {
      return (this._lessons[lessonIndex] = lesson);
    } else {
      throw new Error('Lesson not found');
    }
  }
  async delete(id: string): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      this._lessons.splice(lessonIndex, 1);
      return 'Operação concluída com sucesso';
    } else {
      throw new Error('Lesson not found');
    }
  }
  async addStudents(id: string, newStudentsList: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedStudent = this._lessons[lessonIndex];
        newStudentsList.forEach(id => {
          updatedStudent.addStudent(id);
        });
        this._lessons[lessonIndex] = updatedStudent;
        return `${newStudentsList.length} ${
          newStudentsList.length === 1 ? 'value was' : 'values were'
        } entered`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Lesson not found');
    }
  }
  async removeStudents(
    id: string,
    studentsListToRemove: string[]
  ): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedStudent = this._lessons[lessonIndex];
        studentsListToRemove.forEach(id => {
          updatedStudent.removeStudent(id);
        });
        this._lessons[lessonIndex] = updatedStudent;
        return `${studentsListToRemove.length} ${
          studentsListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Lesson not found');
    }
  }

  async addDay(id: string, newDaysList: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedStudent = this._lessons[lessonIndex];
        newDaysList.forEach(day => {
          updatedStudent.addDay(day as DayOfWeek);
        });
        this._lessons[lessonIndex] = updatedStudent;
        return `${newDaysList.length} ${
          newDaysList.length === 1 ? 'value was' : 'values were'
        } entered`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Lesson not found');
    }
  }
  async removeDay(id: string, daysListToRemove: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedStudent = this._lessons[lessonIndex];
        daysListToRemove.forEach(day => {
          updatedStudent.removeDay(day as DayOfWeek);
        });
        this._lessons[lessonIndex] = updatedStudent;
        return `${daysListToRemove.length} ${
          daysListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Lesson not found');
    }
  }
  async addTime(id: string, newTimesList: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedStudent = this._lessons[lessonIndex];
        newTimesList.forEach(time => {
          updatedStudent.addTime(time as Hour);
        });
        this._lessons[lessonIndex] = updatedStudent;
        return `${newTimesList.length} ${
          newTimesList.length === 1 ? 'value was' : 'values were'
        } entered`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Lesson not found');
    }
  }
  async removeTime(id: string, timesListToRemove: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedStudent = this._lessons[lessonIndex];
        timesListToRemove.forEach(time => {
          updatedStudent.removeTime(time as Hour);
        });
        this._lessons[lessonIndex] = updatedStudent;
        return `${timesListToRemove.length} ${
          timesListToRemove.length === 1 ? 'value was' : 'values were'
        } removed`;
      } catch (error) {
        throw error;
      }
    } else {
      throw new Error('Lesson not found');
    }
  }
}
