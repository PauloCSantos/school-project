import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FindUserStudentOutputDto } from '../../dto/student-usecase.dto';
import UserStudentGateway from '../../gateway/student.gateway';
import { StudentMapper } from '@/modules/user-management/infrastructure/mapper/student.mapper';

export default class FindUserStudentByBaseUser
  implements
    UseCaseInterface<
      TokenData,
      Pick<FindUserStudentOutputDto, 'id' | 'paymentYear'> | null
    >
{
  constructor(private readonly userStudentRepository: UserStudentGateway) {}
  async execute({
    email,
    masterId,
  }: TokenData): Promise<Pick<FindUserStudentOutputDto, 'id' | 'paymentYear'> | null> {
    const response = await this.userStudentRepository.findByBaseUserId(masterId, email);
    if (response) {
      const { id, paymentYear } = StudentMapper.toObj(response);
      return { id, paymentYear };
    }
    return null;
  }
}
