import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Name from '../../domain/@shared/value-object/name.value-object';
import Address from '../../domain/@shared/value-object/address.value-object';
import { UserBase } from '../../domain/entity/user.entity';
import type { IFindUserOutput as UserMapperProps } from '../dto/base-user.dto';
import { MapperError } from '@/modules/authentication-authorization-management/application/errors/mapper.error';

/**
 * Interface that defines the data structure for mapping User entities
 */
export type { UserMapperProps };

/**
 * Mapper responsible for converting between User entity and DTOs
 */
export class UserMapper {
  /**
   * Converts an User entity into a plain object (DTO)
   * @param input User entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: UserBase): UserMapperProps {
    if (!input || !(input instanceof UserBase)) {
      throw new MapperError('Invalid User entity provided to mapper');
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
    };
  }

  /**
   * Converts a plain object (DTO) into an User entity
   * @param input Object with User properties
   * @returns User instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: UserMapperProps): UserBase {
    if (!input || !input.id) {
      throw new MapperError('Invalid User data provided to mapper');
    }
    const { firstName, middleName, lastName } = this.parseName(input.name.fullName);

    return new UserBase({
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
    });
  }

  static toObjList(entities: UserBase[]): UserMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  static toInstanceList(inputs: UserMapperProps[]): UserBase[] {
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
    const middleName = rest.length > 1 ? rest.slice(0, -1).join(' ') : undefined;
    return { firstName, lastName, middleName };
  }
}
