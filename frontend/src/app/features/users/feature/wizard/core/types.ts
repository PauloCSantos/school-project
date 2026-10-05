import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../../../../domain/users/role.type';

export type CreationMode = 'full' | 'partial';

export type ControlType =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'select'
  | 'currency'
  | 'cnpj'
  | 'address'
  | 'name'
  | 'salary';

export interface FieldValidatorRequired {
  name: 'required';
}

export interface FieldValidatorMin {
  name: 'min';
  args: number;
}

export interface FieldValidatorMax {
  name: 'max';
  args: number;
}

export interface FieldValidatorEmail {
  name: 'email';
}

export interface FieldValidatorPattern {
  name: 'pattern';
  args: RegExp | string;
}

export interface FieldValidatorCustom<T = unknown> {
  name: 'custom';
  args?: T;
}

export type FieldValidator =
  | FieldValidatorRequired
  | FieldValidatorMin
  | FieldValidatorMax
  | FieldValidatorEmail
  | FieldValidatorPattern
  | FieldValidatorCustom;

export interface FieldOption<V extends string | number = string | number> {
  label: string;
  value: V;
}

export interface FieldConfig<
  TForm = unknown,
  V extends string | number = string | number,
  K extends string = string
> {
  key: K;
  label: string;
  type: ControlType;
  placeholder?: string;
  options$?: Observable<ReadonlyArray<FieldOption<V>>>;
  visibleWhen?: (formValue: Readonly<TForm>) => boolean;
  requiredWhen?: (formValue: Readonly<TForm>) => boolean;
  validators?: ReadonlyArray<FieldValidator>;
  defaultValue?: unknown;
  hint?: string;
  preserveOnRoleChange?: boolean;
}

export interface StepConfig<K extends string = string> {
  title: string;
  description?: string;
  fields: ReadonlyArray<K>;
  showOn?: ReadonlyArray<CreationMode>;
}

export interface IUserProfileService<TRequest, TResponse = unknown> {
  create(payload: TRequest): Observable<TResponse>;
  update?(id: string, payload: TRequest): Observable<TResponse>;
}

export interface RoleWizardConfig<
  TForm = unknown,
  TRequest extends Record<string, unknown> = Record<string, unknown>
> {
  role: Role;
  label: string;
  steps: StepConfig[];
  fields: ReadonlyArray<FieldConfig>;
  toRequest: (formValue: TForm) => TRequest;
  serviceToken: InjectionToken<IUserProfileService<TRequest>>;
  capabilities?: {
    canList?: boolean;
    canEdit?: boolean;
  };
  defaults?: Partial<TForm>;
}
