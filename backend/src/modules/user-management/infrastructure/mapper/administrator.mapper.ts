import Administrator from '../../domain/entity/administrator.entity';
import Salary from '../../domain/@shared/value-object/salary.value-object';
import type { IFindUserAdministratorOutput } from '../dto/base-administrator.dto';

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
      userId: input.userId,
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

    return new Administrator({
      id: input.id,
      userId: input.userId,
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
}
