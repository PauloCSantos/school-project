import { toStateType } from '@/modules/@shared/utils/formatting';
import Master from '../../domain/entity/master.entity';
import type { IFindUserMasterOutput as MasterMapperProps } from '../dto/base-master.dto';
import { MapperError } from '@/modules/authentication-authorization-management/application/errors/mapper.error';

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
      throw new MapperError('Invalid Master entity provided to mapper');
    }

    return {
      id: input.id.value,
      userId: input.userId,
      cnpj: input.cnpj,
      state: input.state,
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
      throw new MapperError('Invalid Master data provided to mapper');
    }

    return new Master({
      id: input.id,
      userId: input.userId,
      cnpj: input.cnpj,
      state: toStateType(input.state),
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
}
