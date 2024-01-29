import {
  DeleteUserTeacherInputDto,
  DeleteUserTeacherOutputDto,
} from '@/application/dto/user-management/teacher-usecase.dto';
import UseCaseInterface from '../../@shared/use-case.interface';
import UserTeacherGateway from '@/infraestructure/gateway/user-management-repository/user-teacher.gateway';

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
