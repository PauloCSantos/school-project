import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserStudentInputDto,
  DeleteUserStudentOutputDto,
} from '../../dto/student-usecase.dto';
import UserStudentGateway from '@/modules/user-management/infrastructure/gateway/user-student.gateway';

export default class DeleteUserStudent
  implements
    UseCaseInterface<DeleteUserStudentInputDto, DeleteUserStudentOutputDto>
{
  private _userStudentRepository: UserStudentGateway;

  constructor(userStudentRepository: UserStudentGateway) {
    this._userStudentRepository = userStudentRepository;
  }
  async execute({
    id,
  }: DeleteUserStudentInputDto): Promise<DeleteUserStudentOutputDto> {
    const userVerification = await this._userStudentRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userStudentRepository.delete(id);

    return { message: result };
  }
}
