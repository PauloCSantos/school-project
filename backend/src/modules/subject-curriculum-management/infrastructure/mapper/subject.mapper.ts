import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Subject from '@/modules/subject-curriculum-management/domain/entity/subject.entity';
import type { IFindSubjectOutput as SubjectMapperProps } from '../dto/base-subject.dto';
import { toStateType } from '@/modules/@shared/utils/formatting';

/**
 * Interface that defines the data structure for mapping Subject entities
 */
export type { SubjectMapperProps };

/**
 * Mapper responsible for converting between Subject entity and DTOs
 */
export class SubjectMapper {
  /**
   * Converts a Subject entity into a plain object (DTO)
   * @param input Subject entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Subject): SubjectMapperProps {
    if (!input || !(input instanceof Subject)) {
      throw new Error('Invalid Subject entity provided to mapper');
    }

    return {
      id: input.id.value,
      name: input.name,
      description: input.description,
      state: input.state,
    };
  }

  /**
   * Converts a plain object (DTO) into a Subject entity
   * @param input Object with Subject properties
   * @returns Subject instance
   */
  static toInstance(input: SubjectMapperProps): Subject {
    if (!input || !input.id) {
      throw new Error('Invalid subject data provided to mapper');
    }

    return new Subject({
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      state: toStateType(input.state),
    });
  }

  /**
   * Converts a list of Subject entities into plain objects (DTOs)
   * @param entities List of Subject entities
   * @returns List of plain objects representing the entities
   */
  static toObjList(entities: Subject[]): SubjectMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Subject entities
   * @param inputs List of objects with Subject properties
   * @returns List of Subject instances
   */
  static toInstanceList(inputs: SubjectMapperProps[]): Subject[] {
    return inputs.map(input => this.toInstance(input));
  }
}
