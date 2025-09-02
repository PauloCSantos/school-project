import Id from '@/modules/@shared/domain/value-object/id.value-object';
import Note from '@/modules/evaluation-note-attendance-management/domain/entity/note.entity';
import type { IFindNoteOutput as NoteMapperProps } from '../dto/base-note.dto';
import { toStateType } from '@/modules/@shared/utils/formatting';
import { MapperError } from '@/modules/authentication-authorization-management/application/errors/mapper.error';
import { FindNoteOutputDto } from '../../application/dto/note-usecase.dto';

/**
 * Interface that defines the data structure for mapping Note entities
 */
export type { NoteMapperProps };
/**
 * Mapper responsible for converting between Note entity and DTOs
 */
export class NoteMapper {
  /**
   * Converts a Note entity into a plain object (DTO) to the repository
   */
  static toObjRepository(input: Note): NoteMapperProps {
    if (!input || !(input instanceof Note)) {
      throw new MapperError('Invalid Note entity provided to mapper');
    }

    return {
      id: input.id.value,
      evaluation: input.evaluation,
      student: input.student,
      note: input.note,
      state: input.state,
    };
  }
  /**
   * Converts a Note entity into a plain object (DTO)
   */
  static toObj(input: Note): FindNoteOutputDto {
    if (!input || !(input instanceof Note)) {
      throw new MapperError('Invalid Note entity provided to mapper');
    }

    return {
      id: input.id.value,
      evaluation: input.evaluation,
      student: input.student,
      note: input.note,
    };
  }

  /**
   * Converts a plain object (DTO) into a Note entity
   */
  static toInstance(input: NoteMapperProps): Note {
    if (!input || !input.id) {
      throw new MapperError('Invalid note data provided to mapper');
    }

    return new Note({
      id: new Id(input.id),
      evaluation: input.evaluation,
      student: input.student,
      note: input.note,
      state: toStateType(input.state),
    });
  }

  /**
   * Converts a list of Note entities into plain objects (DTOs)
   */
  static toObjList(entities: Note[]): FindNoteOutputDto[] {
    return entities.map(entity => this.toObj(entity));
  }

  /**
   * Converts a list of plain objects (DTOs) into Note entities
   */
  static toInstanceList(inputs: NoteMapperProps[]): Note[] {
    return inputs.map(input => this.toInstance(input));
  }
}
