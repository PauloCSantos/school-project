import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Master from '../../domain/entity/master.entity';
import Name from '../../domain/@shared/value-object/name.value-object';
import Address from '../../domain/@shared/value-object/address.value-object';
import type { IFindUserMasterOutput as MasterMapperProps } from '../../application/dto/base-master.dto';

/**
 * Interface that defines the data structure for mapping Master entities
 */
export type { MasterMapperProps };

/**
 * Mapper responsible for converting between Master entity and DTOs
 */
export class MasterMapper {
  /**
   * Converts an Master entity into a plain object (DTO)
   * @param input Master entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Master): MasterMapperProps {
    if (!input || !(input instanceof Master)) {
      throw new Error('Invalid Master entity provided to mapper');
    }

    return {
      id: input.id.value,
      name: {
        fullName: input.name.fullName(),
        shortName: input.name.shortName(),
      },
      address: {
        street: input.address.street,
        city: input.address.city,
        zip: input.address.zip,
        number: input.address.number,
        avenue: input.address.avenue,
        state: input.address.state,
      },
      email: input.email,
      birthday: input.birthday,
      cnpj: input.cnpj,
    };
  }

  /**
   * Converts a plain object (DTO) into an Master entity
   * @param input Object with Master properties
   * @returns Master instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: MasterMapperProps): Master {
    if (!input || !input.id) {
      throw new Error('Invalid Master data provided to mapper');
    }
    const { firstName, middleName, lastName } = this.parseName(
      input.name.fullName
    );

    return new Master({
      id: new Id(input.id),
      name: new Name({
        firstName,
        lastName,
        middleName,
      }),
      address: new Address({
        street: input.address.street,
        city: input.address.city,
        zip: input.address.zip,
        number: input.address.number,
        avenue: input.address.avenue,
        state: input.address.state,
      }),
      email: input.email,
      birthday: input.birthday as Date,
      cnpj: input.cnpj,
    });
  }

  /**
   * Converts a list of Master entities into plain objects (DTOs)
   * @param entities List of Master entities
   * @returns List of plain objects representing the entities
   */
  static toObjList(entities: Master[]): MasterMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Master entities
   * @param inputs List of objects with Master properties
   * @returns List of Master instances
   */
  static toInstanceList(inputs: MasterMapperProps[]): Master[] {
    return inputs.map(input => this.toInstance(input));
  }

  private static parseName(fullName: string): {
    firstName: string;
    lastName: string;
    middleName?: string;
  } {
    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
    const [firstName, ...rest] = parts;
    const lastName = rest[rest.length - 1];
    const middleName =
      rest.length > 1 ? rest.slice(0, -1).join(' ') : undefined;
    return {
      firstName,
      lastName,
      middleName,
    };
  }
}
