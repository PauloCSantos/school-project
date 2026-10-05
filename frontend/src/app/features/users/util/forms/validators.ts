import {
  FieldValidatorRequired,
  FieldValidatorMin,
  FieldValidatorMax,
  FieldValidatorEmail,
  FieldValidatorPattern,
  FieldValidatorCustom,
} from '../../feature/wizard/core/types';

export function required(): FieldValidatorRequired {
  return { name: 'required' };
}

export function min(n: number): FieldValidatorMin {
  return { name: 'min', args: n };
}

export function max(n: number): FieldValidatorMax {
  return { name: 'max', args: n };
}

export function email(): FieldValidatorEmail {
  return { name: 'email' };
}

export function pattern(rx: RegExp | string): FieldValidatorPattern {
  return { name: 'pattern', args: rx };
}

export function custom<T = unknown>(args?: T): FieldValidatorCustom<T> {
  return { name: 'custom', args };
}

export const v: {
  required: () => FieldValidatorRequired;
  min: (n: number) => FieldValidatorMin;
  max: (n: number) => FieldValidatorMax;
  email: () => FieldValidatorEmail;
  pattern: (rx: RegExp | string) => FieldValidatorPattern;
  custom: <T = unknown>(args?: T) => FieldValidatorCustom<T>;
} = {
  required,
  min,
  max,
  email,
  pattern,
  custom,
};
