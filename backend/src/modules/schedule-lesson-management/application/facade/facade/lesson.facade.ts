import AddTime from '../../usecases/lesson/add-time.usecase';
import CreateLesson from '../../usecases/lesson/create.usecase';
import DeleteLesson from '../../usecases/lesson/delete.usecase';
import FindAllLesson from '../../usecases/lesson/find-all.usecase';
import FindLesson from '../../usecases/lesson/find.usecase';
import RemoveDay from '../../usecases/lesson/remove-day.usecase';
import RemoveTime from '../../usecases/lesson/remove-time.usecase';
import UpdateLesson from '../../usecases/lesson/update.usecase';
import AddDay from '../../usecases/lesson/add-day.usecase';
import AddStudents from '../../usecases/lesson/add-students.usecase';
import RemoveStudents from '../../usecases/lesson/remove-students.usecase';
import LessonFacadeInterface from '../interface/lesson.interface';
import {
  AddDayInputDto,
  AddDayOutputDto,
  RemoveDayInputDto,
  RemoveDayOutputDto,
  AddTimeInputDto,
  AddTimeOutputDto,
  RemoveTimeInputDto,
  RemoveTimeOutputDto,
  CreateLessonInputDto,
  CreateLessonOutputDto,
  AddStudentsInputDto,
  AddStudentsOutputDto,
  DeleteLessonInputDto,
  DeleteLessonOutputDto,
  FindAllLessonInputDto,
  FindAllLessonOutputDto,
  FindLessonInputDto,
  FindLessonOutputDto,
  RemoveStudentsInputDto,
  RemoveStudentsOutputDto,
  UpdateLessonInputDto,
  UpdateLessonOutputDto,
} from '../../dto/lesson-facade.dto';

/**
 * Properties required to initialize the LessonFacade
 */
type LessonFacadeProps = {
  readonly createLesson: CreateLesson;
  readonly deleteLesson: DeleteLesson;
  readonly findAllLesson: FindAllLesson;
  readonly findLesson: FindLesson;
  readonly updateLesson: UpdateLesson;
  readonly addStudents: AddStudents;
  readonly removeStudents: RemoveStudents;
  readonly addDay: AddDay;
  readonly removeDay: RemoveDay;
  readonly addTime: AddTime;
  readonly removeTime: RemoveTime;
};

/**
 * Facade implementation for lesson operations
 *
 * This class provides a unified interface to the underlying lesson
 * use cases, simplifying client interaction with the lesson subsystem.
 */
export default class LessonFacade implements LessonFacadeInterface {
  private readonly _createLesson: CreateLesson;
  private readonly _deleteLesson: DeleteLesson;
  private readonly _findAllLesson: FindAllLesson;
  private readonly _findLesson: FindLesson;
  private readonly _updateLesson: UpdateLesson;
  private readonly _addStudents: AddStudents;
  private readonly _removeStudents: RemoveStudents;
  private readonly _addDay: AddDay;
  private readonly _removeDay: RemoveDay;
  private readonly _addTime: AddTime;
  private readonly _removeTime: RemoveTime;

  /**
   * Creates a new instance of LessonFacade
   * @param input Dependencies required by the facade
   */
  constructor(input: LessonFacadeProps) {
    this._createLesson = input.createLesson;
    this._deleteLesson = input.deleteLesson;
    this._findAllLesson = input.findAllLesson;
    this._findLesson = input.findLesson;
    this._updateLesson = input.updateLesson;
    this._addStudents = input.addStudents;
    this._removeStudents = input.removeStudents;
    this._addDay = input.addDay;
    this._removeDay = input.removeDay;
    this._addTime = input.addTime;
    this._removeTime = input.removeTime;
  }

  /**
   * Creates a new lesson
   * @param input Lesson creation parameters
   * @returns Information about the created lesson
   */
  public async create(
    input: CreateLessonInputDto
  ): Promise<CreateLessonOutputDto> {
    return await this._createLesson.execute(input);
  }

  /**
   * Finds a lesson by ID
   * @param input Search parameters
   * @returns Lesson information if found, null otherwise
   */
  public async find(
    input: FindLessonInputDto
  ): Promise<FindLessonOutputDto | null> {
    const result = await this._findLesson.execute(input);
    return result || null;
  }

  /**
   * Retrieves all lessons with optional filtering
   * @param input Search parameters for filtering lessons
   * @returns Collection of lessons matching criteria
   */
  public async findAll(
    input: FindAllLessonInputDto
  ): Promise<FindAllLessonOutputDto> {
    return await this._findAllLesson.execute(input);
  }

  /**
   * Deletes a lesson
   * @param input Lesson identification
   * @returns Confirmation message
   */
  public async delete(
    input: DeleteLessonInputDto
  ): Promise<DeleteLessonOutputDto> {
    return await this._deleteLesson.execute(input);
  }

  /**
   * Updates a lesson's information
   * @param input Lesson identification and data to update
   * @returns Updated lesson information
   */
  public async update(
    input: UpdateLessonInputDto
  ): Promise<UpdateLessonOutputDto> {
    return await this._updateLesson.execute(input);
  }

  /**
   * Adds students to a lesson
   * @param input Lesson ID and student IDs to add
   * @returns Updated lesson information
   */
  public async addStudents(
    input: AddStudentsInputDto
  ): Promise<AddStudentsOutputDto> {
    return await this._addStudents.execute(input);
  }

  /**
   * Removes students from a lesson
   * @param input Lesson ID and student IDs to remove
   * @returns Updated lesson information
   */
  public async removeStudents(
    input: RemoveStudentsInputDto
  ): Promise<RemoveStudentsOutputDto> {
    return await this._removeStudents.execute(input);
  }

  /**
   * Adds a day to a lesson's schedule
   * @param input Lesson ID and day to add
   * @returns Updated lesson information
   */
  public async addDay(input: AddDayInputDto): Promise<AddDayOutputDto> {
    return await this._addDay.execute(input);
  }

  /**
   * Removes a day from a lesson's schedule
   * @param input Lesson ID and day to remove
   * @returns Updated lesson information
   */
  public async removeDay(
    input: RemoveDayInputDto
  ): Promise<RemoveDayOutputDto> {
    return await this._removeDay.execute(input);
  }

  /**
   * Adds a time slot to a lesson
   * @param input Lesson ID and time to add
   * @returns Updated lesson information
   */
  public async addTime(input: AddTimeInputDto): Promise<AddTimeOutputDto> {
    return await this._addTime.execute(input);
  }

  /**
   * Removes a time slot from a lesson
   * @param input Lesson ID and time to remove
   * @returns Updated lesson information
   */
  public async removeTime(
    input: RemoveTimeInputDto
  ): Promise<RemoveTimeOutputDto> {
    return await this._removeTime.execute(input);
  }
}
