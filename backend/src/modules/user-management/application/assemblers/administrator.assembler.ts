import Administrator from '../../domain/entity/administrator.entity';
import { UserBase } from '../../domain/entity/user.entity';
import { IFindUserAdministratorOutput as AdministratorAssemblerProps } from '../dto/base-administrator.dto';

/**
 * Interface that defines the data structure for mapping Administrator entities
 */
export type { AdministratorAssemblerProps };

/**
 * Mapper responsible for converting between Administrator entity and DTOs
 */
export class AdministratorAssembler {
  /**
   * Converts an Administrator entity into a plain object (DTO)
   * @param user Administrator entity to be converted
   * @param administrator Administrator entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(
    user: UserBase,
    administrator: Administrator
  ): AdministratorAssemblerProps {
    return {
      id: administrator.id.value,
      name: {
        fullName: user.name.fullName(),
        shortName: user.name.shortName(),
      },
      address: {
        street: user.address.street,
        city: user.address.city,
        zip: user.address.zip,
        number: user.address.number,
        avenue: user.address.avenue,
        state: user.address.state,
      },
      email: user.email,
      birthday: user.birthday,
      salary: administrator.salary.calculateTotalIncome(),
      graduation: administrator.graduation,
    };
  }

  static toObjList(
    results: readonly { entity: Administrator; user: UserBase }[]
  ): AdministratorAssemblerProps[] {
    return results.map(({ entity, user }) => this.toObj(user, entity));
  }
}
