import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Curriculum from '../../domain/entity/curriculum.entity';
import type { IFindCurriculumOutput as CurriculumMapperProps } from '../dto/base-curriculum.dto';
import { toStateType } from '@/modules/@shared/utils/formatting';

/**
 * Interface that defines the data structure for mapping Curriculum entities
 */
export type { CurriculumMapperProps };

/**
 * Mapper responsible for converting between Curriculum entity and DTOs
 */
export class CurriculumMapper {
  /**
   * Converts a Curriculum entity into a plain object (DTO)
   * @param input Curriculum entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: Curriculum): CurriculumMapperProps {
    if (!input || !(input instanceof Curriculum)) {
      throw new Error('Invalid Curriculum entity provided to mapper');
    }

    return {
      id: input.id.value,
      name: input.name,
      yearsToComplete: input.yearsToComplete,
      subjectsList: input.subjectList,
      state: input.state,
    };
  }

  /**
   * Converts a plain object (DTO) into a Curriculum entity
   * @param input Object with Curriculum properties
   * @returns Curriculum instance
   */
  static toInstance(input: CurriculumMapperProps): Curriculum {
    if (!input || !input.id) {
      throw new Error('Invalid curriculum data provided to mapper');
    }

    return new Curriculum({
      id: new Id(input.id),
      name: input.name,
      yearsToComplete: input.yearsToComplete,
      subjectsList: input.subjectsList || [],
      state: toStateType(input.state),
    });
  }

  /**
   * Converts a list of Curriculum entities into plain objects (DTOs)
   * @param entities List of Curriculum entities
   * @returns List of plain objects representing the entities
   */
  static toObjList(entities: Curriculum[]): CurriculumMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Curriculum entities
   * @param inputs List of objects with Curriculum properties
   * @returns List of Curriculum instances
   */
  static toInstanceList(inputs: CurriculumMapperProps[]): Curriculum[] {
    return inputs.map(input => this.toInstance(input));
  }
}
