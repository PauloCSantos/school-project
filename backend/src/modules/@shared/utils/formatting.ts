import { StatesEnum } from '../enums/enums';
import { States } from '../type/sharedTypes';

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toStateType(input: string): States {
  if (!input) {
    throw new Error('Invalid input');
  }

  const key = input.trim().toUpperCase() as keyof typeof StatesEnum;
  const value = StatesEnum[key];

  if (!value) {
    throw new Error('Invalid input');
  }

  return value as States;
}
