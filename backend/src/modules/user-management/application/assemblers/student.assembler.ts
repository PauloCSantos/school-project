import Student from '../../domain/entity/student.entity';
import { UserBase } from '../../domain/entity/user.entity';
import { IFindUserStudentOutput as StudentAssemblerProps } from '../dto/base-student.dto';

/**
 * Interface that defines the data structure for mapping Student entities
 */
export type { StudentAssemblerProps };

/**
 * Mapper responsible for converting between Student entity and DTOs
 */
export class StudentAssembler {
  /**
   * Converts an Student entity into a plain object (DTO)
   * @param user Student entity to be converted
   * @param student Student entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(user: UserBase, student: Student): StudentAssemblerProps {
    return {
      id: student.id.value,
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
      paymentYear: student.paymentYear,
    };
  }

  static toObjList(
    results: readonly { entity: Student; user: UserBase }[]
  ): StudentAssemblerProps[] {
    return results.map(({ entity, user }) => this.toObj(user, entity));
  }
}
