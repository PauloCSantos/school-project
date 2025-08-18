import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Administrator from '../../domain/entity/administrator.entity';
import Name from '../../domain/@shared/value-object/name.value-object';
import Address from '../../domain/@shared/value-object/address.value-object';
import Salary from '../../domain/@shared/value-object/salary.value-object';
import type { IFindUserAdministratorOutput } from '../../application/dto/base-administrator.dto';

/**
 * Interface that defines the data structure for mapping Administrator entities
 */
type Override<T, R> = Omit<T, keyof R> & R;

export type AdministratorMapperProps = Override<
  IFindUserAdministratorOutput,
  { salary: { salary: number; currency: 'R$' | '€' | '$' } }
>;

/**
 * Mapper responsible for converting between Administrator entity and DTOs
 */
export class AdministratorMapper {
  /**
   * Converts an Administrator entity into a plain object (DTO)
   * @param input Administrator entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Administrator): AdministratorMapperProps {
    if (!input || !(input instanceof Administrator)) {
      throw new Error('Invalid Administrator entity provided to mapper');
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
      salary: { salary: input.salary.salary, currency: input.salary.currency },
      graduation: input.graduation,
    };
  }

  /**
   * Converts a plain object (DTO) into an Administrator entity
   * @param input Object with Administrator properties
   * @returns Administrator instance
   * @throws Error if the input is invalid
   */
  static toInstance(input: AdministratorMapperProps): Administrator {
    if (!input || !input.id) {
      throw new Error('Invalid Administrator data provided to mapper');
    }
    const { firstName, middleName, lastName } = this.parseName(
      input.name.fullName
    );

    return new Administrator({
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
      salary: new Salary({
        salary: input.salary.salary,
        currency: input.salary.currency,
      }),
      graduation: input.graduation,
    });
  }

  static toObjList(entities: Administrator[]): AdministratorMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  static toInstanceList(inputs: AdministratorMapperProps[]): Administrator[] {
    return inputs.map(input => this.toInstance(input));
  }

  static toDTO(input: Administrator): IFindUserAdministratorOutput {
    if (!input || !(input instanceof Administrator)) {
      throw new Error('Invalid Administrator entity provided to mapper');
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
      salary: input.salary.calculateTotalIncome(),
      graduation: input.graduation,
    };
  }

  static toDTOList(inputs: Administrator[]): IFindUserAdministratorOutput[] {
    return inputs.map(input => this.toDTO(input));
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
    return { firstName, lastName, middleName };
  }
}
