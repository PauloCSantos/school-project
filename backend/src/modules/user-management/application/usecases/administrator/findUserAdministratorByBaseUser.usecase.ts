import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FindUserAdministratorOutputDto } from '../../dto/administrator-usecase.dto';
import UserAdministratorGateway from '../../gateway/administrator.gateway';
import { AdministratorMapper } from '@/modules/user-management/infrastructure/mapper/administrator.mapper';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';

export default class FindUserAdministratorByBaseUser
  implements
    UseCaseInterface<
      TokenData,
      Pick<FindUserAdministratorOutputDto, 'id' | 'graduation' | 'salary'> | null
    >
{
  constructor(
    private readonly userAdministratorRepository: UserAdministratorGateway,
    private readonly userService: UserServiceInterface
  ) {}
  async execute({
    email,
    masterId,
  }: TokenData): Promise<Pick<
    FindUserAdministratorOutputDto,
    'id' | 'graduation' | 'salary'
  > | null> {
    const userBase = await this.userService.findBaseUserByEmail(email);
    const response = await this.userAdministratorRepository.findByBaseUserId(
      masterId,
      userBase.id.value
    );
    if (response) {
      const salary = response.salary.calculateTotalIncome();
      const { id, graduation } = AdministratorMapper.toObj(response);
      return { id, graduation, salary };
    }
    return null;
  }
}
