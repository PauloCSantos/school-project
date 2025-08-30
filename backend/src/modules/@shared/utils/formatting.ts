import { RoleTypeError } from '../application/errors/role-type.error';
import { ValidationError } from '../application/errors/validation.error';
import { RoleUsersEnum, StatesEnum } from '../enums/enums';
import { RoleUsers, States } from '../type/sharedTypes';

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toStateType(input: string): States {
  if (!input) {
    throw new ValidationError('Invalid input');
  }

  const key = input.trim().toUpperCase() as keyof typeof StatesEnum;
  const value = StatesEnum[key];

  if (!value) {
    throw new ValidationError('Invalid input');
  }

  return value as States;
}

export function toRoleType(input: string): RoleUsers {
  if (!input) {
    throw new ValidationError('Invalid input');
  }

  const key = input.trim().toUpperCase() as keyof typeof RoleUsersEnum;
  const value = RoleUsersEnum[key];

  if (!value) {
    throw new RoleTypeError(input);
  }

  return value as RoleUsers;
}
