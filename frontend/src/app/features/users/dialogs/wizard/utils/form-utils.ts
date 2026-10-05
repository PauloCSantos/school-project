// src/app/features/users/dialogs/wizard/utils/form-utils.ts
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FieldConfig, FieldValidator } from '../../../feature/wizard/core/types';
import {
  cnpjValidator,
  positiveMoneyValidator,
} from '../../../../../core/validators/profile.validator';

/* =========================
   Helpers para paths aninhados
   ========================= */
export function getControlByPath(group: FormGroup, path: string): AbstractControl | null {
  const parts = path.split('.');
  let ctrl: AbstractControl | null = group;
  for (const p of parts) {
    if (!(ctrl instanceof FormGroup)) return null;
    ctrl = (ctrl.controls as any)[p] ?? null;
  }
  return ctrl;
}

export function setControlByPath(
  group: FormGroup,
  path: string,
  control: FormControl | FormGroup
): void {
  const parts = path.split('.');
  const last = parts.pop() as string;
  let cursor: FormGroup = group;
  for (const p of parts) {
    const next = (cursor.controls as any)[p];
    if (!next) {
      const fg = new FormGroup({});
      cursor.addControl(p, fg);
      cursor = fg;
    } else {
      if (next instanceof FormGroup) {
        cursor = next;
      } else {
        cursor.removeControl(p);
        const fg = new FormGroup({});
        cursor.addControl(p, fg);
        cursor = fg;
      }
    }
  }
  cursor.addControl(last, control);
}

/* =========================
   Validadores custom
   ========================= */
const CUSTOM_VALIDATORS: Record<string, ValidatorFn> = {
  positiveMoney: positiveMoneyValidator,
  cnpj: cnpjValidator,
};

export function mapValidators(defs: ReadonlyArray<FieldValidator> = []): ValidatorFn[] {
  return defs.map((v) => {
    switch (v.name) {
      case 'required':
        return Validators.required;
      case 'min':
        return Validators.min(v.args as number);
      case 'max':
        return Validators.max(v.args as number);
      case 'email':
        return Validators.email;
      case 'pattern':
        return Validators.pattern(v.args as string | RegExp);
      case 'custom': {
        const key = String(v.args ?? '');
        const fn = CUSTOM_VALIDATORS[key];
        if (!fn) {
          return () => ({ unknownCustomValidator: { key } } as ValidationErrors);
        }
        return fn;
      }
      default:
        return Validators.nullValidator;
    }
  });
}

/* =========================
   Form Builder dinâmico
   ========================= */
export function buildForm(
  fb: FormBuilder,
  fields: ReadonlyArray<FieldConfig>,
  defaults: any = {}
): FormGroup {
  const group = fb.group({}, { updateOn: 'change' });

  for (const f of fields) {
    const validators = mapValidators(f.validators);
    const value = pickValue(defaults, f.key, null);

    switch (f.type) {
      case 'address': {
        const v = value || {};
        const address = fb.group(
          {
            street: [v.street ?? '', Validators.required],
            avenue: [v.avenue ?? ''],
            number: [v.number ?? null, [Validators.required, Validators.min(1)]],
            city: [v.city ?? '', Validators.required],
            state: [v.state ?? '', Validators.required],
            zip: [v.zip ?? '', Validators.required],
          },
          { updateOn: 'change' }
        );
        setControlByPath(group, f.key, address);
        break;
      }

      case 'salary': {
        const v = value || {};
        const fieldValidators = mapValidators(f.validators);
        const salary = fb.group(
          {
            salary: [
              v.salary ?? null,
              [Validators.required, positiveMoneyValidator, ...fieldValidators],
            ],
            currency: [v.currency ?? 'R$'],
          },
          { updateOn: 'change' }
        );
        setControlByPath(group, f.key, salary);
        break;
      }

      case 'name': {
        const v = value || {};
        const name = fb.group(
          {
            firstName: [v.firstName ?? '', Validators.required],
            middleName: [v.middleName ?? ''],
            lastName: [v.lastName ?? '', Validators.required],
          },
          { updateOn: 'change' }
        );
        setControlByPath(group, f.key, name);
        break;
      }

      default: {
        setControlByPath(group, f.key, fb.control(value, { validators, updateOn: 'change' }));
        break;
      }
    }
  }

  return group;
}

function pickValue(obj: any, path: string, fallback: any) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return fallback;
    cur = cur[p];
  }
  return cur ?? fallback;
}
