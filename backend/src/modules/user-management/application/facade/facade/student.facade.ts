import CreateUserStudent from '../../usecases/student/createUserStudent.usecase';
import DeleteUserStudent from '../../usecases/student/deleteUserStudent.usecase';
import FindAllUserStudent from '../../usecases/student/findAllUserStudent.usecase';
import FindUserStudent from '../../usecases/student/findUserStudent.usecase';
import UpdateUserStudent from '../../usecases/student/updateUserStudent.usecase';
import StudentFacadeInterface from '../interface/student-facade.interface';
import {
  CreateUserStudentInputDto,
  CreateUserStudentOutputDto,
  DeleteUserStudentInputDto,
  DeleteUserStudentOutputDto,
  FindAllUserStudentInputDto,
  FindAllUserStudentOutputDto,
  FindUserStudentInputDto,
  FindUserStudentOutputDto,
  UpdateUserStudentInputDto,
  UpdateUserStudentOutputDto,
} from '../../dto/student-facade.dto';
import { PoliciesServiceInterface } from '@/modules/@shared/application/services/policies.service';
import { TokenData } from '@/modules/@shared/type/sharedTypes';

type StudentFacadeProps = {
  readonly createUserStudent: CreateUserStudent;
  readonly deleteUserStudent: DeleteUserStudent;
  readonly findAllUserStudent: FindAllUserStudent;
  readonly findUserStudent: FindUserStudent;
  readonly updateUserStudent: UpdateUserStudent;
  readonly policiesService: PoliciesServiceInterface;
};
export default class StudentFacade implements StudentFacadeInterface {
  private readonly _createUserStudent: CreateUserStudent;
  private readonly _deleteUserStudent: DeleteUserStudent;
  private readonly _findAllUserStudent: FindAllUserStudent;
  private readonly _findUserStudent: FindUserStudent;
  private readonly _updateUserStudent: UpdateUserStudent;
  private readonly _policiesService: PoliciesServiceInterface;

  constructor(input: StudentFacadeProps) {
    this._createUserStudent = input.createUserStudent;
    this._deleteUserStudent = input.deleteUserStudent;
    this._findAllUserStudent = input.findAllUserStudent;
    this._findUserStudent = input.findUserStudent;
    this._updateUserStudent = input.updateUserStudent;
    this._policiesService = input.policiesService;
  }

  async create(
    input: CreateUserStudentInputDto,
    token: TokenData
  ): Promise<CreateUserStudentOutputDto> {
    return await this._createUserStudent.execute(
      input,
      this._policiesService,
      token
    );
  }
  async find(
    input: FindUserStudentInputDto,
    token: TokenData
  ): Promise<FindUserStudentOutputDto | null> {
    return await this._findUserStudent.execute(
      input,
      this._policiesService,
      token
    );
  }
  async findAll(
    input: FindAllUserStudentInputDto,
    token: TokenData
  ): Promise<FindAllUserStudentOutputDto> {
    return await this._findAllUserStudent.execute(
      input,
      this._policiesService,
      token
    );
  }
  async delete(
    input: DeleteUserStudentInputDto,
    token: TokenData
  ): Promise<DeleteUserStudentOutputDto> {
    return await this._deleteUserStudent.execute(
      input,
      this._policiesService,
      token
    );
  }
  async update(
    input: UpdateUserStudentInputDto,
    token: TokenData
  ): Promise<UpdateUserStudentOutputDto> {
    return await this._updateUserStudent.execute(
      input,
      this._policiesService,
      token
    );
  }
}
