import {
  CreateLessonInputDto,
  AddDayInputDto,
  AddDayOutputDto,
  AddStudentsInputDto,
  AddStudentsOutputDto,
  AddTimeInputDto,
  AddTimeOutputDto,
  CreateLessonOutputDto,
  DeleteLessonInputDto,
  DeleteLessonOutputDto,
  FindAllLessonInputDto,
  FindAllLessonOutputDto,
  FindLessonInputDto,
  FindLessonOutputDto,
  RemoveDayInputDto,
  RemoveDayOutputDto,
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
  RemoveTimeInputDto,
  RemoveTimeOutputDto,
  UpdateLessonInputDto,
  UpdateLessonOutputDto,
} from '../../application/dto/lesson-usecase.dto';
import AddDay from '../../application/usecases/lesson/add-day.usecase';
import AddStudents from '../../application/usecases/lesson/add-students.usecase';
import AddTime from '../../application/usecases/lesson/add-time.usecase';
import CreateLesson from '../../application/usecases/lesson/create.usecase';
import DeleteLesson from '../../application/usecases/lesson/delete.usecase';
import FindAllLesson from '../../application/usecases/lesson/find-all.usecase';
import FindLesson from '../../application/usecases/lesson/find.usecase';
import RemoveDay from '../../application/usecases/lesson/remove-day.usecase';
import RemoveStudents from '../../application/usecases/lesson/remove-students.usecase';
import RemoveTime from '../../application/usecases/lesson/remove-time.usecase';
import UpdateLesson from '../../application/usecases/lesson/update.usecase';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

/**
 * Controller for lesson management operations.
 * Handles HTTP requests by delegating to appropriate use cases.
 */
export class LessonController {
  /**
   * Creates a new LessonController instance.
   * @param createLesson - Use case for creating a new lesson
   * @param findLesson - Use case for finding a lesson
   * @param findAllLesson - Use case for retrieving all lessons
   * @param updateLesson - Use case for updating a lesson
   * @param deleteLesson - Use case for deleting a lesson
   * @param addStudentstoLesson - Use case for adding students to a lesson
   * @param removeStudentstoLesson - Use case for removing students from a lesson
   * @param addDaytoLesson - Use case for adding a day to a lesson
   * @param removeDaytoLesson - Use case for removing a day from a lesson
   * @param addTimetoLesson - Use case for adding a time slot to a lesson
   * @param removeTimetoLesson - Use case for removing a time slot from a lesson
   */
  constructor(
    private readonly createLesson: CreateLesson,
    private readonly findLesson: FindLesson,
    private readonly findAllLesson: FindAllLesson,
    private readonly updateLesson: UpdateLesson,
    private readonly deleteLesson: DeleteLesson,
    private readonly addStudentstoLesson: AddStudents,
    private readonly removeStudentstoLesson: RemoveStudents,
    private readonly addDaytoLesson: AddDay,
    private readonly removeDaytoLesson: RemoveDay,
    private readonly addTimetoLesson: AddTime,
    private readonly removeTimetoLesson: RemoveTime
  ) {}

  /**
   * Creates a new lesson.
   * @param input - The data for creating a new lesson
   * @returns Promise resolving to the created lesson data
   */
  async create(
    input: CreateLessonInputDto,
    token: TokenData
  ): Promise<CreateLessonOutputDto> {
    const response = await this.createLesson.execute(input, token);
    return response;
  }

  /**
   * Finds a lesson by its identifier.
   * @param input - The input containing the identifier to search for
   * @returns Promise resolving to the found lesson data or null
   */
  async find(
    input: FindLessonInputDto,
    token: TokenData
  ): Promise<FindLessonOutputDto | null> {
    const response = await this.findLesson.execute(input, token);
    return response;
  }

  /**
   * Retrieves all lessons matching the specified criteria.
   * @param input - The input containing search criteria
   * @returns Promise resolving to the list of lessons
   */
  async findAll(
    input: FindAllLessonInputDto,
    token: TokenData
  ): Promise<FindAllLessonOutputDto> {
    const response = await this.findAllLesson.execute(input, token);
    return response;
  }

  /**
   * Deletes a lesson.
   * @param input - The input containing the identifier of the lesson to delete
   * @returns Promise resolving to the deletion confirmation
   */
  async delete(
    input: DeleteLessonInputDto,
    token: TokenData
  ): Promise<DeleteLessonOutputDto> {
    const response = await this.deleteLesson.execute(input, token);
    return response;
  }

  /**
   * Updates a lesson.
   * @param input - The input containing the lesson data to update
   * @returns Promise resolving to the updated lesson data
   */
  async update(
    input: UpdateLessonInputDto,
    token: TokenData
  ): Promise<UpdateLessonOutputDto> {
    const response = await this.updateLesson.execute(input, token);
    return response;
  }

  /**
   * Adds students to a lesson.
   * @param input - The input containing lesson ID and student IDs to add
   * @returns Promise resolving to the updated lesson with added students
   */
  async addStudents(
    input: AddStudentsInputDto,
    token: TokenData
  ): Promise<AddStudentsOutputDto> {
    const response = await this.addStudentstoLesson.execute(input, token);
    return response;
  }

  /**
   * Removes students from a lesson.
   * @param input - The input containing lesson ID and student IDs to remove
   * @returns Promise resolving to the updated lesson with removed students
   */
  async removeStudents(
    input: RemoveStudentsInputDto,
    token: TokenData
  ): Promise<RemoveStudentsOutputDto> {
    const response = await this.removeStudentstoLesson.execute(input, token);
    return response;
  }

  /**
   * Adds a time slot to a lesson.
   * @param input - The input containing lesson ID and time data to add
   * @returns Promise resolving to the updated lesson with added time
   */
  async addTime(
    input: AddTimeInputDto,
    token: TokenData
  ): Promise<AddTimeOutputDto> {
    const response = await this.addTimetoLesson.execute(input, token);
    return response;
  }

  /**
   * Removes a time slot from a lesson.
   * @param input - The input containing lesson ID and time data to remove
   * @returns Promise resolving to the updated lesson with removed time
   */
  async removeTime(
    input: RemoveTimeInputDto,
    token: TokenData
  ): Promise<RemoveTimeOutputDto> {
    const response = await this.removeTimetoLesson.execute(input, token);
    return response;
  }

  /**
   * Adds a day to a lesson's schedule.
   * @param input - The input containing lesson ID and day data to add
   * @returns Promise resolving to the updated lesson with added day
   */
  async addDay(
    input: AddDayInputDto,
    token: TokenData
  ): Promise<AddDayOutputDto> {
    const response = await this.addDaytoLesson.execute(input, token);
    return response;
  }

  /**
   * Removes a day from a lesson's schedule.
   * @param input - The input containing lesson ID and day data to remove
   * @returns Promise resolving to the updated lesson with removed day
   */
  async removeDay(
    input: RemoveDayInputDto,
    token: TokenData
  ): Promise<RemoveDayOutputDto> {
    const response = await this.removeDaytoLesson.execute(input, token);
    return response;
  }
}
