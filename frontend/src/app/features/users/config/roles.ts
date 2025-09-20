import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type RoleKey = 'administrator' | 'teacher' | 'student' | 'worker' | 'master';

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

export interface FieldValidator {
  name: 'required' | 'min' | 'max' | 'email' | 'pattern' | 'custom';
  args?: unknown;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: ControlType;
  placeholder?: string;
  options$?: Observable<{ label: string; value: string | number }[]>;
  visibleWhen?: (formValue: any) => boolean;
  requiredWhen?: (formValue: any) => boolean;
  validators?: FieldValidator[];
  defaultValue?: unknown;
  hint?: string;
  preserveOnRoleChange?: boolean;
}

export interface StepConfig {
  title: string;
  description?: string;
  fields: string[];
}

export interface IUserProfileService<TRequest> {
  create(payload: TRequest): Observable<any>;
  update?(id: string, payload: TRequest): Observable<any>;
}

export interface RoleWizardConfig<TForm = any, TRequest = any> {
  role: RoleKey;
  label: string;
  steps: StepConfig[];
  fields: FieldConfig[];
  toRequest: (formValue: TForm) => TRequest;
  serviceToken: InjectionToken<IUserProfileService<TRequest>>;
  capabilities?: { canList?: boolean; canEdit?: boolean };
  defaults?: Partial<TForm>;
}
