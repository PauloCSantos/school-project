import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Evaluation from '@/modules/evaluation-note-attendance-management/domain/entity/evaluation.entity';
import type { IFindEvaluationOutput as EvaluationMapperProps } from '../dto/base-evaluation.dto';
import { toStateType } from '@/modules/@shared/utils/formatting';

/**
 * Interface that defines the data structure for mapping Evaluation entities
 */
export type { EvaluationMapperProps };

/**
 * Mapper responsible for converting between Evaluation entity and DTOs
 */
export class EvaluationMapper {
  /**
   * Converts an Evaluation entity into a plain object (DTO)
   */
  static toObj(input: Evaluation): EvaluationMapperProps {
    if (!input || !(input instanceof Evaluation)) {
      throw new Error('Invalid Evaluation entity provided to mapper');
    }

    return {
      id: input.id.value,
      teacher: input.teacher,
      lesson: input.lesson,
      type: input.type,
      value: input.value,
      state: input.state,
    };
  }

  /**
   * Converts a plain object (DTO) into an Evaluation entity
   */
  static toInstance(input: EvaluationMapperProps): Evaluation {
    if (!input || !input.id) {
      throw new Error('Invalid evaluation data provided to mapper');
    }

    return new Evaluation({
      id: new Id(input.id),
      teacher: input.teacher,
      lesson: input.lesson,
      type: input.type,
      value: input.value,
      state: toStateType(input.state),
    });
  }

  /**
   * Converts a list of Evaluation entities into plain objects (DTOs)
   */
  static toObjList(entities: Evaluation[]): EvaluationMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Evaluation entities
   */
  static toInstanceList(inputs: EvaluationMapperProps[]): Evaluation[] {
    return inputs.map(input => this.toInstance(input));
  }
}
