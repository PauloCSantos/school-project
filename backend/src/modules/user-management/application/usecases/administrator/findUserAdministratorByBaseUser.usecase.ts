import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { FindUserAdministratorOutputDto } from '../../dto/administrator-usecase.dto';
import UserAdministratorGateway from '../../gateway/administrator.gateway';
import { AdministratorMapper } from '@/modules/user-management/infrastructure/mapper/administrator.mapper';

export default class FindUserAdministratorByBaseUser
  implements
    UseCaseInterface<
      TokenData,
      Pick<FindUserAdministratorOutputDto, 'id' | 'graduation' | 'salary'> | null
    >
{
  constructor(private readonly userAdministratorRepository: UserAdministratorGateway) {}
  async execute({
    email,
    masterId,
  }: TokenData): Promise<Pick<
    FindUserAdministratorOutputDto,
    'id' | 'graduation' | 'salary'
  > | null> {
    const response = await this.userAdministratorRepository.findByBaseUserId(
      masterId,
      email
    );
    if (response) {
      const salary = response.salary.calculateTotalIncome();
      const { id, graduation } = AdministratorMapper.toObj(response);
      return { id, graduation, salary };
    }
    return null;
  }
}
