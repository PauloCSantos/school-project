import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FindUserTeacherOutputDto } from '../../dto/teacher-usecase.dto';
import UserTeacherGateway from '../../gateway/teacher.gateway';
import { TeacherMapper } from '@/modules/user-management/infrastructure/mapper/teacher.mapper';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';

export default class FindUserTeacherByBaseUser
  implements
    UseCaseInterface<
      TokenData,
      Pick<
        FindUserTeacherOutputDto,
        'id' | 'academicDegrees' | 'graduation' | 'salary'
      > | null
    >
{
  constructor(
    private readonly userTeacherRepository: UserTeacherGateway,
    private readonly userService: UserServiceInterface
  ) {}
  async execute({
    email,
    masterId,
  }: TokenData): Promise<Pick<
    FindUserTeacherOutputDto,
    'id' | 'academicDegrees' | 'graduation' | 'salary'
  > | null> {
    const userBase = await this.userService.findBaseUserByEmail(email);
    const response = await this.userTeacherRepository.findByBaseUserId(
      masterId,
      userBase.id.value
    );
    if (response) {
      const salary = response.salary.calculateTotalIncome();
      const { id, academicDegrees, graduation } = TeacherMapper.toObj(response);
      return { id, academicDegrees, graduation, salary };
    }
    return null;
  }
}
