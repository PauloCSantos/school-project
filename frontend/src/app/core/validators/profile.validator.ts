import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const zipValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = String(control.value ?? '').trim();
  if (!v) return null;
  return /^[\w-]{5,8}$/.test(v) ? null : { zip: true };
};

export const cnpjValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v = String(control.value ?? '').replace(/\D/g, '');
  if (!v) return null;
  return /^\d{14}$/.test(v) ? null : { cnpj: true };
};

export const positiveMoneyValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const raw = control.value;
  const v = typeof raw === 'object' ? Number(raw?.salary) : Number(raw);
  if (Number.isNaN(v)) return null;
  return v > 0 ? null : { money: true };
};
