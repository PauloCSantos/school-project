import Lesson from '@/modules/schedule-lesson-management/domain/entity/lesson.entity';
import LessonGateway from '../../gateway/lesson.gateway';

/**
 * In-memory implementation of LessonGateway.
 * Stores and manipulates lessons in memory.
 * Useful for testing and development purposes.
 */
export default class MemoryLessonRepository implements LessonGateway {
  private _lessons: Lesson[];

  /**
   * Creates a new in-memory repository.
   * @param lessons - Optional initial array of lessons
   */
  constructor(lessons?: Lesson[]) {
    lessons ? (this._lessons = lessons) : (this._lessons = []);
  }

  /**
   * Finds a lesson by its ID.
   * @param id - The ID of the lesson to search for
   * @returns Promise resolving to the found Lesson or null if not found
   */
  async find(id: string): Promise<Lesson | null> {
    const lesson = this._lessons.find(lesson => lesson.id.value === id);
    if (lesson) {
      return lesson;
    } else {
      return null;
    }
  }

  /**
   * Retrieves a list of lessons with optional pagination.
   * @param quantity - Optional limit for the number of lessons to retrieve
   * @param offSet - Optional number of lessons to skip before starting to collect
   * @returns Promise resolving to an array of Lesson entities
   */
  async findAll(
    quantity?: number | undefined,
    offSet?: number | undefined
  ): Promise<Lesson[]> {
    const offS = offSet ? offSet : 0;
    const qtd = quantity ? quantity : 10;
    const lessons = this._lessons.slice(offS, qtd);

    return lessons;
  }

  /**
   * Creates a new lesson in memory.
   * @param lesson - The lesson entity to be created
   * @returns Promise resolving to the ID of the created lesson
   */
  async create(lesson: Lesson): Promise<string> {
    this._lessons.push(lesson);
    return lesson.id.value;
  }

  /**
   * Updates an existing lesson identified by ID.
   * @param lesson - The lesson entity with updated information
   * @returns Promise resolving to the updated Lesson entity
   * @throws Error if the lesson is not found
   */
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

  /**
   * Deletes a lesson by its ID.
   * @param id - The ID of the lesson to delete
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found
   */
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

  /**
   * Adds students to a lesson.
   * @param id - The ID of the lesson to update
   * @param newStudentsList - Array of student IDs to add
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if adding students fails
   */
  async addStudents(id: string, newStudentsList: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedLesson = this._lessons[lessonIndex];
        newStudentsList.forEach(id => {
          updatedLesson.addStudent(id);
        });
        this._lessons[lessonIndex] = updatedLesson;
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

  /**
   * Removes students from a lesson.
   * @param id - The ID of the lesson to update
   * @param studentsListToRemove - Array of student IDs to remove
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if removing students fails
   */
  async removeStudents(
    id: string,
    studentsListToRemove: string[]
  ): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedLesson = this._lessons[lessonIndex];
        studentsListToRemove.forEach(id => {
          updatedLesson.removeStudent(id);
        });
        this._lessons[lessonIndex] = updatedLesson;
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

  /**
   * Adds days to a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param newDaysList - Array of day values to add
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if adding days fails
   */
  async addDay(id: string, newDaysList: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedLesson = this._lessons[lessonIndex];
        newDaysList.forEach(day => {
          updatedLesson.addDay(day as DayOfWeek);
        });
        this._lessons[lessonIndex] = updatedLesson;
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

  /**
   * Removes days from a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param daysListToRemove - Array of day values to remove
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if removing days fails
   */
  async removeDay(id: string, daysListToRemove: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedLesson = this._lessons[lessonIndex];
        daysListToRemove.forEach(day => {
          updatedLesson.removeDay(day as DayOfWeek);
        });
        this._lessons[lessonIndex] = updatedLesson;
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

  /**
   * Adds time slots to a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param newTimesList - Array of time values to add
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if adding times fails
   */
  async addTime(id: string, newTimesList: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedLesson = this._lessons[lessonIndex];
        newTimesList.forEach(time => {
          updatedLesson.addTime(time as Hour);
        });
        this._lessons[lessonIndex] = updatedLesson;
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

  /**
   * Removes time slots from a lesson schedule.
   * @param id - The ID of the lesson to update
   * @param timesListToRemove - Array of time values to remove
   * @returns Promise resolving to a success message
   * @throws Error if the lesson is not found or if removing times fails
   */
  async removeTime(id: string, timesListToRemove: string[]): Promise<string> {
    const lessonIndex = this._lessons.findIndex(
      dbLesson => dbLesson.id.value === id
    );
    if (lessonIndex !== -1) {
      try {
        const updatedLesson = this._lessons[lessonIndex];
        timesListToRemove.forEach(time => {
          updatedLesson.removeTime(time as Hour);
        });
        this._lessons[lessonIndex] = updatedLesson;
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
