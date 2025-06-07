import {
  CreateLessonInputDto,
  CreateLessonOutputDto,
  AddDayInputDto,
  AddDayOutputDto,
  AddStudentsInputDto,
  AddStudentsOutputDto,
  AddTimeInputDto,
  AddTimeOutputDto,
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
} from '../../dto/lesson-facade.dto';

/**
 * Interface for lesson operations
 *
 * Provides methods for CRUD operations on lessons and
 * lesson-specific functionality
 */
export default interface LessonFacadeInterface {
  /**
   * Creates a new lesson
   * @param input Lesson creation parameters
   * @returns Information about the created lesson
   */
  create(input: CreateLessonInputDto): Promise<CreateLessonOutputDto>;

  /**
   * Finds a lesson by ID
   * @param input Search parameters
   * @returns Lesson information if found, null otherwise
   */
  find(input: FindLessonInputDto): Promise<FindLessonOutputDto | null>;

  /**
   * Retrieves all lessons with optional filtering
   * @param input Search parameters for filtering lessons
   * @returns Collection of lessons matching criteria
   */
  findAll(input: FindAllLessonInputDto): Promise<FindAllLessonOutputDto>;

  /**
   * Deletes a lesson
   * @param input Lesson identification
   * @returns Confirmation message
   */
  delete(input: DeleteLessonInputDto): Promise<DeleteLessonOutputDto>;

  /**
   * Updates a lesson's information
   * @param input Lesson identification and data to update
   * @returns Updated lesson information
   */
  update(input: UpdateLessonInputDto): Promise<UpdateLessonOutputDto>;

  /**
   * Adds students to a lesson
   * @param input Lesson ID and student IDs to add
   * @returns Updated lesson information
   */
  addStudents(input: AddStudentsInputDto): Promise<AddStudentsOutputDto>;

  /**
   * Removes students from a lesson
   * @param input Lesson ID and student IDs to remove
   * @returns Updated lesson information
   */
  removeStudents(
    input: RemoveStudentsInputDto
  ): Promise<RemoveStudentsOutputDto>;

  /**
   * Adds a day to a lesson's schedule
   * @param input Lesson ID and day to add
   * @returns Updated lesson information
   */
  addDay(input: AddDayInputDto): Promise<AddDayOutputDto>;

  /**
   * Removes a day from a lesson's schedule
   * @param input Lesson ID and day to remove
   * @returns Updated lesson information
   */
  removeDay(input: RemoveDayInputDto): Promise<RemoveDayOutputDto>;

  /**
   * Adds a time slot to a lesson
   * @param input Lesson ID and time to add
   * @returns Updated lesson information
   */
  addTime(input: AddTimeInputDto): Promise<AddTimeOutputDto>;

  /**
   * Removes a time slot from a lesson
   * @param input Lesson ID and time to remove
   * @returns Updated lesson information
   */
  removeTime(input: RemoveTimeInputDto): Promise<RemoveTimeOutputDto>;
}
