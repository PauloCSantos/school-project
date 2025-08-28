import AuthUser from '../../domain/entity/user.entity';
import type { IFindAuthUserOutput as AuthUserMapperProps } from '../dto/base-user.dto';
import { toStateType } from '@/modules/@shared/utils/formatting';
import { AuthUserServiceInterface } from '../../domain/service/interface/user-entity-service.interface';
/**
 * Interface that defines the data structure for mapping User entities
 */

export type { AuthUserMapperProps };

/**
 * Mapper responsible for converting between User entity and DTOs
 */
export class AuthUserMapper {
  /**
   * Converts an User entity into a plain object (DTO)
   * @param input User entity to be converted
   * @returns Plain object representing the entity
   */
  static toObj(input: AuthUser): AuthUserMapperProps {
    if (!input || !(input instanceof AuthUser)) {
      throw new Error('Invalid AuthUser entity provided to mapper');
    }

    return {
      email: input.email,
      password: input.password,
      isHashed: input.isHashed,
      state: input.state,
    };
  }

  /**
   * Converts a plain object (DTO) into an User entity
   * @param input Object with User properties
   * @returns User instance
   * @throws Error if the input is invalid
   */
  static toInstance(
    input: AuthUserMapperProps,
    authUserService: AuthUserServiceInterface
  ): AuthUser {
    if (!input || !input.email) {
      throw new Error('Invalid User data provided to mapper');
    }

    return new AuthUser(
      {
        email: input.email,
        password: input.password,
        isHashed: input.isHashed,
        state: toStateType(input.state),
      },
      authUserService
    );
  }

  static toObjList(entities: AuthUser[]): AuthUserMapperProps[] {
    return entities.map(entity => this.toObj(entity));
  }

  static toInstanceList(
    inputs: AuthUserMapperProps[],
    authUserService: AuthUserServiceInterface
  ): AuthUser[] {
    return inputs.map(input => this.toInstance(input, authUserService));
  }
}
