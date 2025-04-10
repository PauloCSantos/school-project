import AddTime from '../../usecases/lesson/add-time.usecase';
import CreateLesson from '../../usecases/lesson/create.usecase';
import DeleteLesson from '../../usecases/lesson/delete.usecase';
import FindAllLesson from '../../usecases/lesson/find-all.usecase';
import FindLesson from '../../usecases/lesson/find.usecase';
import RemoveDay from '../../usecases/lesson/remove-day.usecase';
import RemoveTime from '../../usecases/lesson/remove-time.usecase';
import UpdateLesson from '../../usecases/lesson/update.usecase';
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

import AddDay from '../../usecases/lesson/add-day.usecase';
import AddStudents from '../../usecases/lesson/add-students.usecase';
import RemoveStudents from '../../usecases/lesson/remove-students.usecase';

type LessonFacadeProps = {
  createLesson: CreateLesson;
  deleteLesson: DeleteLesson;
  findAllLesson: FindAllLesson;
  findLesson: FindLesson;
  updateLesson: UpdateLesson;
  addStudents: AddStudents;
  removeStudents: RemoveStudents;
  addDay: AddDay;
  removeDay: RemoveDay;
  addTime: AddTime;
  removeTime: RemoveTime;
};
export default class LessonFacade implements LessonFacadeInterface {
  private _createLesson: CreateLesson;
  private _deleteLesson: DeleteLesson;
  private _findAllLesson: FindAllLesson;
  private _findLesson: FindLesson;
  private _updateLesson: UpdateLesson;
  private _addStudents: AddStudents;
  private _removeStudents: RemoveStudents;
  private _addDay: AddDay;
  private _removeDay: RemoveDay;
  private _addTime: AddTime;
  private _removeTime: RemoveTime;

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

  async create(input: CreateLessonInputDto): Promise<CreateLessonOutputDto> {
    return await this._createLesson.execute(input);
  }
  async find(
    input: FindLessonInputDto
  ): Promise<FindLessonOutputDto | undefined> {
    return await this._findLesson.execute(input);
  }
  async findAll(input: FindAllLessonInputDto): Promise<FindAllLessonOutputDto> {
    return await this._findAllLesson.execute(input);
  }
  async delete(input: DeleteLessonInputDto): Promise<DeleteLessonOutputDto> {
    return await this._deleteLesson.execute(input);
  }
  async update(input: UpdateLessonInputDto): Promise<UpdateLessonOutputDto> {
    return await this._updateLesson.execute(input);
  }
  async addStudents(input: AddStudentsInputDto): Promise<AddStudentsOutputDto> {
    return await this._addStudents.execute(input);
  }
  async removeStudents(
    input: RemoveStudentsInputDto
  ): Promise<RemoveStudentsOutputDto> {
    return await this._removeStudents.execute(input);
  }
  async addDay(input: AddDayInputDto): Promise<AddDayOutputDto> {
    return await this._addDay.execute(input);
  }
  async removeDay(input: RemoveDayInputDto): Promise<RemoveDayOutputDto> {
    return await this._removeDay.execute(input);
  }
  async addTime(input: AddTimeInputDto): Promise<AddTimeOutputDto> {
    return await this._addTime.execute(input);
  }
  async removeTime(input: RemoveTimeInputDto): Promise<RemoveTimeOutputDto> {
    return await this._removeTime.execute(input);
  }
}
