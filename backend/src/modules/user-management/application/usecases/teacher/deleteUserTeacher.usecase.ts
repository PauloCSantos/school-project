import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import {
  DeleteUserTeacherInputDto,
  DeleteUserTeacherOutputDto,
} from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '@/modules/user-management/infrastructure/gateway/user-teacher.gateway';

export default class DeleteUserTeacher
  implements
    UseCaseInterface<DeleteUserTeacherInputDto, DeleteUserTeacherOutputDto>
{
  private _userTeacherRepository: UserTeacherGateway;

  constructor(userTeacherRepository: UserTeacherGateway) {
    this._userTeacherRepository = userTeacherRepository;
  }
  async execute({
    id,
  }: DeleteUserTeacherInputDto): Promise<DeleteUserTeacherOutputDto> {
    const userVerification = await this._userTeacherRepository.find(id);
    if (!userVerification) throw new Error('User not found');

    const result = await this._userTeacherRepository.delete(id);

    return { message: result };
  }
}
