import Master from '../../domain/entity/master.entity';
import { UserBase } from '../../domain/entity/user.entity';
import { IFindUserMasterOutput as MasterAssemblerProps } from '../dto/base-master.dto';

/**
 * Interface that defines the data structure for mapping Master entities
 */
export type { MasterAssemblerProps };

/**
 * Mapper responsible for converting between Master entity and DTOs
 */
export class MasterAssembler {
  /**
   * Converts an Master entity into a plain object (DTO)
   * @param user Master entity to be converted
   * @param master Master entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(user: UserBase, master: Master): MasterAssemblerProps {
    return {
      id: master.id.value,
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
      cnpj: master.cnpj,
    };
  }

  static toObjList(
    results: readonly { entity: Master; user: UserBase }[]
  ): MasterAssemblerProps[] {
    return results.map(({ entity, user }) => this.toObj(user, entity));
  }
}
