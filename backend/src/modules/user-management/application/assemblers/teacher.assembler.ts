import Teacher from '../../domain/entity/teacher.entity';
import { UserBase } from '../../domain/entity/user.entity';
import { IFindUserTeacherOutput as TeacherAssemblerProps } from '../dto/base-teacher.dto';

/**
 * Interface that defines the data structure for mapping Teacher entities
 */
export type { TeacherAssemblerProps };

/**
 * Mapper responsible for converting between Teacher entity and DTOs
 */
export class TeacherAssembler {
  /**
   * Converts an Teacher entity into a plain object (DTO)
   * @param user Teacher entity to be converted
   * @param teacher Teacher entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(user: UserBase, teacher: Teacher): TeacherAssemblerProps {
    return {
      id: teacher.id.value,
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
      salary: teacher.salary.calculateTotalIncome(),
      graduation: teacher.graduation,
      academicDegrees: teacher.academicDegrees,
    };
  }

  static toObjList(
    results: readonly { entity: Teacher; user: UserBase }[]
  ): TeacherAssemblerProps[] {
    return results.map(({ entity, user }) => this.toObj(user, entity));
  }
}
