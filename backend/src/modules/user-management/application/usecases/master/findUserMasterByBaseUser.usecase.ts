import UseCaseInterface from '@/modules/@shared/application/usecases/use-case.interface';
import { FindUserMasterOutputDto } from '../../../application/dto/master-usecase.dto';
import UserMasterGateway from '@/modules/user-management/application/gateway/master.gateway';
import { TokenData } from '@/modules/@shared/type/sharedTypes';
import { MasterMapper } from '@/modules/user-management/infrastructure/mapper/master.mapper';
import { UserServiceInterface } from '@/modules/user-management/domain/services/user.service';

export default class FindUserMasterByBaseUser
  implements
    UseCaseInterface<TokenData, Pick<FindUserMasterOutputDto, 'id' | 'cnpj'> | null>
{
  constructor(
    private readonly userMasterRepository: UserMasterGateway,
    private readonly userService: UserServiceInterface
  ) {}
  async execute({
    email,
    masterId,
  }: TokenData): Promise<Pick<FindUserMasterOutputDto, 'id' | 'cnpj'> | null> {
    const userBase = await this.userService.findBaseUserByEmail(email);
    const response = await this.userMasterRepository.findByBaseUserId(
      masterId,
      userBase.id.value
    );
    if (response) {
      const { id, cnpj } = MasterMapper.toObj(response);
      return { id, cnpj };
    }
    return null;
  }
}
